"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { createNotificationAndDeliver } from "@/lib/notifications/client";

type LikeButtonProps = {
  postId: string;
  postAuthorId?: string | null;
  initialLiked?: boolean;
  initialCount?: number;
  className?: string;
};

export default function LikeButton({
  postId,
  postAuthorId,
  initialLiked = false,
  initialCount = 0,
  className = "",
}: LikeButtonProps) {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (loading) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push(`/login?next=/posts/${postId}`);
      return;
    }

    setLoading(true);

    if (liked) {
      const { error } = await supabase.from("likes").delete().eq("post_id", postId).eq("user_id", user.id);
      if (!error) {
        setLiked(false);
        setCount((value) => Math.max(0, value - 1));
        router.refresh();
      }
    } else {
      const { error } = await supabase.from("likes").insert({ post_id: postId, user_id: user.id });
      if (!error) {
        if (postAuthorId && postAuthorId !== user.id) {
          try {
            await createNotificationAndDeliver({
              userId: postAuthorId,
              actorId: user.id,
              type: "like",
              postId,
            });
          } catch {}
        }
        setLiked(true);
        setCount((value) => value + 1);
        router.refresh();
      }
    }

    setLoading(false);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={`rounded-xl border border-border bg-panelSoft px-3 py-2 transition hover:text-text disabled:opacity-60 ${className}`.trim()}
    >
      {loading ? "Saving..." : liked ? `Liked • ${count}` : `Like • ${count}`}
    </button>
  );
}
