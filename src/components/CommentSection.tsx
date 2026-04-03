"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { createNotificationAndDeliver } from "@/lib/notifications/client";
import CommentLikeButton from "@/components/CommentLikeButton";

type CommentProfile = { username?: string | null; display_name?: string | null };

type CommentItem = {
  id: string;
  user_id?: string | null;
  parent_id?: string | null;
  content: string;
  created_at?: string | null;
  like_count?: number;
  initial_liked?: boolean;
  profiles?: CommentProfile | CommentProfile[] | null;
};

type CommentSectionProps = {
  postId: string;
  postAuthorId?: string | null;
  comments: CommentItem[];
};

function getAuthor(comment: CommentItem) {
  return Array.isArray(comment.profiles) ? comment.profiles[0] : comment.profiles;
}

function getThreadParentId(comment: CommentItem) {
  return comment.parent_id || comment.id;
}

export default function CommentSection({ postId, postAuthorId, comments }: CommentSectionProps) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const router = useRouter();
  const [content, setContent] = useState("");
  const [replyParentId, setReplyParentId] = useState<string | null>(null);
  const [replyTargetCommentId, setReplyTargetCommentId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [replyError, setReplyError] = useState<string | null>(null);

  const commentsById = useMemo(() => new Map(comments.map((comment) => [comment.id, comment])), [comments]);

  const topLevelComments = useMemo(
    () => comments.filter((comment) => !comment.parent_id || !commentsById.has(comment.parent_id)),
    [comments, commentsById],
  );

  const repliesByParentId = useMemo(() => {
    const map = new Map<string, CommentItem[]>();

    for (const comment of comments) {
      if (!comment.parent_id) continue;
      const threadParentId = commentsById.has(comment.parent_id) ? comment.parent_id : comment.id;
      const existing = map.get(threadParentId) || [];
      existing.push(comment);
      map.set(threadParentId, existing);
    }

    return map;
  }, [comments, commentsById]);

  async function submitComment(options: {
    trimmed: string;
    parentId?: string | null;
    replyToComment?: CommentItem | null;
  }) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push(`/login?next=/posts/${postId}`);
      return { ok: false as const, error: null };
    }

    const { trimmed, parentId = null, replyToComment = null } = options;

    const { error } = await supabase.from("comments").insert({
      post_id: postId,
      user_id: user.id,
      parent_id: parentId,
      content: trimmed,
    });

    if (error) {
      return { ok: false as const, error: error.message };
    }

    if (replyToComment?.user_id && replyToComment.user_id !== user.id) {
      try {
        await createNotificationAndDeliver({
          userId: replyToComment.user_id,
          actorId: user.id,
          type: "comment",
          postId,
          commentId: replyToComment.id,
          metadata: {
            target: "reply",
            excerpt: trimmed.slice(0, 120),
            comment_excerpt: replyToComment.content.slice(0, 120),
          },
        });
      } catch {}
    }

    if (postAuthorId && postAuthorId !== user.id && postAuthorId !== replyToComment?.user_id) {
      try {
        await createNotificationAndDeliver({
          userId: postAuthorId,
          actorId: user.id,
          type: "comment",
          postId,
          commentId: replyToComment?.id ?? null,
          metadata: { excerpt: trimmed.slice(0, 120) },
        });
      } catch {}
    }

    return { ok: true as const, error: null };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const trimmed = content.trim();
    if (!trimmed) return;

    setLoading(true);
    const result = await submitComment({ trimmed });
    setLoading(false);

    if (!result.ok) {
      if (result.error) setError(result.error);
      return;
    }

    setContent("");
    router.refresh();
  }

  async function handleReplySubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setReplyError(null);
    const trimmed = replyContent.trim();
    if (!trimmed || !replyParentId || !replyTargetCommentId) return;

    const replyTargetComment = commentsById.get(replyTargetCommentId) || null;

    setLoading(true);
    const result = await submitComment({
      trimmed,
      parentId: replyParentId,
      replyToComment: replyTargetComment,
    });
    setLoading(false);

    if (!result.ok) {
      if (result.error) setReplyError(result.error);
      return;
    }

    setReplyParentId(null);
    setReplyTargetCommentId(null);
    setReplyContent("");
    router.refresh();
  }

  function openReplyForm(comment: CommentItem) {
    setReplyError(null);
    setReplyParentId(getThreadParentId(comment));
    setReplyTargetCommentId(comment.id);
    setReplyContent("");
  }

  function renderComment(comment: CommentItem, isReply = false) {
    const author = getAuthor(comment);
    const username = author?.username || "member";
    const displayName = author?.display_name || username;
    const replies = repliesByParentId.get(comment.id) || [];
    const isReplyComposerOpen = replyParentId === comment.id;
    const replyTarget = replyTargetCommentId ? commentsById.get(replyTargetCommentId) || null : null;
    const replyTargetAuthor = replyTarget ? getAuthor(replyTarget) : null;
    const replyTargetUsername = replyTargetAuthor?.username || "member";

    return (
      <div key={comment.id} className={`rounded-2xl border border-border bg-panel p-5 ${isReply ? "bg-panelSoft" : ""}`.trim()}>
        <div className="flex items-center gap-2 text-sm">
          <Link href={`/profile/${username}`} className="font-semibold text-text hover:underline">{displayName}</Link>
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
          {!isReply ? (
            <button
              type="button"
              onClick={() => openReplyForm(comment)}
              className="rounded-xl border border-border bg-panelSoft px-3 py-2 text-sm transition hover:text-text"
            >
              Reply
            </button>
          ) : null}
          {!isReply && replies.length ? <span className="text-xs uppercase tracking-[0.14em] text-muted">{replies.length} repl{replies.length === 1 ? "y" : "ies"}</span> : null}
        </div>

        {replies.length ? (
          <div className="mt-5 space-y-3 border-l border-border pl-4">
            {replies.map((reply) => renderComment(reply, true))}
          </div>
        ) : null}

        {isReplyComposerOpen ? (
          <form className="mt-5 space-y-3 border-l border-border pl-4" onSubmit={handleReplySubmit}>
            <div className="text-xs uppercase tracking-[0.14em] text-muted">
              Replying to @{replyTargetUsername}
            </div>
            <textarea
              className="textarea"
              value={replyContent}
              onChange={(event) => setReplyContent(event.target.value)}
              placeholder="Write a reply..."
              rows={3}
            />
            {replyError ? <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{replyError}</div> : null}
            <div className="flex flex-wrap gap-3">
              <button type="submit" className="button-primary" disabled={loading}>
                {loading ? "Posting..." : "Post reply"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setReplyParentId(null);
                  setReplyTargetCommentId(null);
                  setReplyContent("");
                  setReplyError(null);
                }}
                className="rounded-xl border border-border bg-panelSoft px-4 py-2 text-sm transition hover:text-text"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="card">
        <h2 className="text-lg font-semibold">Comments</h2>
        <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
          <textarea
            className="textarea"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Add your comment to the discussion..."
            rows={4}
          />
          {error ? <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div> : null}
          <button type="submit" className="button-primary" disabled={loading}>
            {loading ? "Posting..." : "Post comment"}
          </button>
        </form>
      </div>

      {topLevelComments.length ? topLevelComments.map((comment) => renderComment(comment)) : <div className="card text-sm text-muted">No comments yet.</div>}
    </div>
  );
}
