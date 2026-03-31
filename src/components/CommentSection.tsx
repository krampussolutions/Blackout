"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { createNotificationAndDeliver } from "@/lib/notifications/client";

type CommentItem = {
  id: string;
  content: string;
  created_at?: string | null;
  profiles?: { username?: string | null; display_name?: string | null } | { username?: string | null; display_name?: string | null }[] | null;
};

type CommentSectionProps = {
  postId: string;
  comments: CommentItem[];
  postOwnerId?: string | null;
  postTitle?: string;
};

export default function CommentSection({ postId, comments, postOwnerId = null, postTitle = "" }: CommentSectionProps) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const router = useRouter();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (!content.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push(`/login?next=/posts/${postId}`);
      return;
    }

    setLoading(true);
    const trimmed = content.trim();
    const { data: insertedComment, error } = await supabase.from("comments").insert({
      post_id: postId,
      user_id: user.id,
      content: trimmed,
    }).select("id").maybeSingle();
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    if (postOwnerId && postOwnerId !== user.id) {
      await createNotificationAndDeliver({
        userId: postOwnerId,
        actorId: user.id,
        type: "comment",
        postId: postId,
        commentId: insertedComment?.id ?? null,
        metadata: {
          post_title: postTitle || null,
          comment_excerpt: trimmed.slice(0, 140),
        },
      });
    }

    setContent("");
    router.refresh();
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

      {comments.length ? comments.map((comment) => {
        const author = Array.isArray(comment.profiles) ? comment.profiles[0] : comment.profiles;
        const username = author?.username || "member";
        const displayName = author?.display_name || username;
        return (
          <div key={comment.id} className="card">
            <div className="flex items-center gap-2 text-sm">
              <Link href={`/profile/${username}`} className="font-semibold text-text hover:underline">{displayName}</Link>
              <span className="text-muted">@{username}</span>
              <span className="text-xs text-muted">
                {comment.created_at ? new Date(comment.created_at).toLocaleString() : "Just now"}
              </span>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-muted">{comment.content}</p>
          </div>
        );
      }) : <div className="card text-sm text-muted">No comments yet.</div>}
    </div>
  );
}
