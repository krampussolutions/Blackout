"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type FollowButtonProps = {
  targetUserId?: string | null;
  targetUsername?: string;
  initialIsFollowing?: boolean;
  className?: string;
  disabled?: boolean;
};

export default function FollowButton({
  targetUserId,
  targetUsername,
  initialIsFollowing = false,
  className = "",
  disabled = false,
}: FollowButtonProps) {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (!targetUserId || disabled || loading) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push(`/login?next=/profile/${targetUsername || ""}`);
      return;
    }

    if (user.id === targetUserId) {
      return;
    }

    setLoading(true);

    if (isFollowing) {
      const { error } = await supabase
        .from("follows")
        .delete()
        .eq("follower_id", user.id)
        .eq("following_id", targetUserId);

      if (!error) {
        setIsFollowing(false);
        router.refresh();
      }
    } else {
      const { error } = await supabase.from("follows").insert({
        follower_id: user.id,
        following_id: targetUserId,
      });

      if (!error) {
        setIsFollowing(true);
        router.refresh();
      }
    }

    setLoading(false);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || loading || !targetUserId}
      className={`${isFollowing ? "button-secondary" : "button-primary"} ${className}`.trim()}
    >
      {loading ? "Saving..." : isFollowing ? "Following" : "Follow"}
    </button>
  );
}
