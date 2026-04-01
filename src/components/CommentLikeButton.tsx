"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { createNotificationAndDeliver } from "@/lib/notifications/client";

type CommentLikeButtonProps = {
  commentId: string;
  postId: string;
  commentAuthorId?: string | null;
  commentExcerpt?: string | null;
  initialLiked?: boolean;
  initialCount?: number;
};

export default function CommentLikeButton({
  commentId,
  postId,
  commentAuthorId,
  commentExcerpt,
  initialLiked = false,
  initialCount = 0,
}: CommentLikeButtonProps) {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (loading) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push(`/login?next=/posts/${postId}`);
      return;
    }

    setLoading(true);

    if (liked) {
      const { error } = await supabase
        .from("comment_likes")
        .delete()
        .eq("comment_id", commentId)
        .eq("user_id", user.id);

      if (!error) {
        setLiked(false);
        setCount((current) => Math.max(0, current - 1));
      }

      setLoading(false);
      return;
    }

    const { error } = await supabase.from("comment_likes").insert({
      comment_id: commentId,
      user_id: user.id,
    });

    if (!error) {
      setLiked(true);
      setCount((current) => current + 1);

      if (commentAuthorId && commentAuthorId !== user.id) {
        try {
          await createNotificationAndDeliver({
            userId: commentAuthorId,
            actorId: user.id,
            type: "like",
            postId,
            commentId,
            metadata: {
              target: "comment",
              comment_excerpt: commentExcerpt?.slice(0, 120) ?? null,
            },
          });
        } catch {}
      }
    }

    setLoading(false);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="rounded-xl border border-border bg-panelSoft px-3 py-1.5 text-xs text-muted transition hover:text-text disabled:opacity-60"
    >
      {loading ? "Saving..." : liked ? `Liked • ${count}` : `Like • ${count}`}
    </button>
  );
}
