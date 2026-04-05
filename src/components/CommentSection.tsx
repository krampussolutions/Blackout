"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { createNotificationAndDeliver } from "@/lib/notifications/client";
import CommentLikeButton from "@/components/CommentLikeButton";

type CommentItem = {
  id: string;
  parent_id?: string | null;
  user_id?: string | null;
  content: string;
  created_at?: string | null;
  like_count?: number;
  initial_liked?: boolean;
  profiles?:
    | { username?: string | null; display_name?: string | null }
    | { username?: string | null; display_name?: string | null }[]
    | null;
};

type CommentSectionProps = {
  postId: string;
  postAuthorId?: string | null;
  comments: CommentItem[];
};

const ROOT_KEY = "__root__";

export default function CommentSection({ postId, postAuthorId, comments }: CommentSectionProps) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const router = useRouter();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [replyTargetId, setReplyTargetId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [replyLoadingId, setReplyLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const commentsById = useMemo(() => {
    const map = new Map<string, CommentItem>();
    comments.forEach((comment) => {
      map.set(comment.id, comment);
    });
    return map;
  }, [comments]);

  const commentsByParent = useMemo(() => {
    const map = new Map<string, CommentItem[]>();

    comments.forEach((comment) => {
      const parentKey = comment.parent_id && commentsById.has(comment.parent_id) ? comment.parent_id : ROOT_KEY;
      const existing = map.get(parentKey) || [];
      existing.push(comment);
      map.set(parentKey, existing);
    });

    return map;
  }, [comments, commentsById]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>, parentId?: string | null) {
    event.preventDefault();
    setError(null);

    const isReply = Boolean(parentId);
    const rawContent = isReply ? replyContent : content;
    const trimmed = rawContent.trim();
    if (!trimmed) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push(`/login?next=/posts/${postId}`);
      return;
    }

    if (isReply) {
      setReplyLoadingId(parentId || null);
    } else {
      setLoading(true);
    }

    const { data: insertedComment, error: insertError } = await supabase
      .from("comments")
      .insert({
        post_id: postId,
        parent_id: parentId || null,
        user_id: user.id,
        content: trimmed,
      })
      .select("id")
      .single();

    if (isReply) {
      setReplyLoadingId(null);
    } else {
      setLoading(false);
    }

    if (insertError) {
      setError(insertError.message);
      return;
    }

    const notificationJobs: Promise<unknown>[] = [];

    if (isReply && parentId) {
      const parentComment = commentsById.get(parentId);

      if (parentComment?.user_id && parentComment.user_id !== user.id) {
        notificationJobs.push(
          createNotificationAndDeliver({
            userId: parentComment.user_id,
            actorId: user.id,
            type: "comment",
            postId,
            commentId: insertedComment?.id ?? null,
            metadata: {
              target: "reply",
              comment_excerpt: trimmed.slice(0, 120),
            },
          }),
        );
      }

      if (postAuthorId && postAuthorId !== user.id && postAuthorId !== parentComment?.user_id) {
        notificationJobs.push(
          createNotificationAndDeliver({
            userId: postAuthorId,
            actorId: user.id,
            type: "comment",
            postId,
            commentId: insertedComment?.id ?? null,
            metadata: { excerpt: trimmed.slice(0, 120) },
          }),
        );
      }
    } else if (postAuthorId && postAuthorId !== user.id) {
      notificationJobs.push(
        createNotificationAndDeliver({
          userId: postAuthorId,
          actorId: user.id,
          type: "comment",
          postId,
          commentId: insertedComment?.id ?? null,
          metadata: { excerpt: trimmed.slice(0, 120) },
        }),
      );
    }

    if (notificationJobs.length) {
      await Promise.allSettled(notificationJobs);
    }

    if (isReply) {
      setReplyContent("");
      setReplyTargetId(null);
    } else {
      setContent("");
    }

    router.refresh();
  }

  function toggleReply(commentId: string) {
    setError(null);
    if (replyTargetId === commentId) {
      setReplyTargetId(null);
      setReplyContent("");
      return;
    }

    setReplyTargetId(commentId);
    setReplyContent("");
  }

  function renderComment(comment: CommentItem, depth = 0): React.ReactNode {
    const author = Array.isArray(comment.profiles) ? comment.profiles[0] : comment.profiles;
    const username = author?.username || "member";
    const displayName = author?.display_name || username;
    const childComments = commentsByParent.get(comment.id) || [];
    const isReplying = replyTargetId === comment.id;
    const isNested = depth > 0;

    return (
      <div
        key={comment.id}
        className={isNested ? "rounded-2xl border border-border bg-panelSoft p-4" : "card"}
      >
        <div className="flex items-center gap-2 text-sm">
          <Link href={`/profile/${username}`} className="font-semibold text-text hover:underline">
            {displayName}
          </Link>
          <span className="text-muted">@{username}</span>
          <span className="text-xs text-muted">
            {comment.created_at ? new Date(comment.created_at).toLocaleString() : "Just now"}
          </span>
        </div>

        <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-muted">{comment.content}</p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <CommentLikeButton
            commentId={comment.id}
            postId={postId}
            commentAuthorId={comment.user_id}
            commentExcerpt={comment.content}
            initialLiked={Boolean(comment.initial_liked)}
            initialCount={comment.like_count || 0}
          />
          <button
            type="button"
            className="rounded-xl border border-border bg-panelSoft px-3 py-2 text-xs font-medium text-muted transition hover:text-text"
            onClick={() => toggleReply(comment.id)}
          >
            {isReplying ? "Cancel" : "Reply"}
          </button>
        </div>

        {isReplying ? (
          <form className="mt-4 space-y-3" onSubmit={(event) => handleSubmit(event, comment.id)}>
            <textarea
              className="textarea"
              value={replyContent}
              onChange={(event) => setReplyContent(event.target.value)}
              placeholder={`Reply to @${username}...`}
              rows={3}
            />
            {error ? (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            ) : null}
            <div className="flex flex-wrap gap-3">
              <button type="submit" className="button-primary" disabled={replyLoadingId === comment.id}>
                {replyLoadingId === comment.id ? "Posting..." : "Post reply"}
              </button>
              <button
                type="button"
                className="rounded-xl border border-border bg-panelSoft px-4 py-2 text-sm font-semibold text-muted transition hover:text-text"
                onClick={() => toggleReply(comment.id)}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : null}

        {childComments.length ? (
          <div className="mt-4 space-y-4 border-l border-border pl-4">
            {childComments.map((child) => renderComment(child, depth + 1))}
          </div>
        ) : null}
      </div>
    );
  }

  const rootComments = commentsByParent.get(ROOT_KEY) || [];

  return (
    <div className="space-y-4">
      <div className="card">
        <h2 className="text-lg font-semibold">Comments</h2>
        <form className="mt-4 space-y-3" onSubmit={(event) => handleSubmit(event)}>
          <textarea
            className="textarea"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Add your comment to the discussion..."
            rows={4}
          />
          {error ? (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          ) : null}
          <button type="submit" className="button-primary" disabled={loading}>
            {loading ? "Posting..." : "Post comment"}
          </button>
        </form>
      </div>

      {rootComments.length ? rootComments.map((comment) => renderComment(comment)) : <div className="card text-sm text-muted">No comments yet.</div>}
    </div>
  );
}
