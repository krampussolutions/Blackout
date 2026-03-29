"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type GroupJoinButtonProps = {
  groupId?: string | null;
  groupSlug?: string;
  initialIsMember?: boolean;
  className?: string;
};

export default function GroupJoinButton({
  groupId,
  groupSlug,
  initialIsMember = false,
  className = "",
}: GroupJoinButtonProps) {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [isMember, setIsMember] = useState(initialIsMember);
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (!groupId || loading) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push(`/login?redirect_to=/groups/${groupSlug || ""}`);
      return;
    }

    setLoading(true);

    if (isMember) {
      const { error } = await supabase
        .from("group_members")
        .delete()
        .eq("group_id", groupId)
        .eq("user_id", user.id);

      if (!error) {
        setIsMember(false);
        router.refresh();
      }
    } else {
      const { error } = await supabase.from("group_members").insert({
        group_id: groupId,
        user_id: user.id,
      });

      if (!error) {
        setIsMember(true);

        const { data: groupRow } = await supabase
          .from("groups")
          .select("slug, name, created_by")
          .eq("id", groupId)
          .maybeSingle();

        if (groupRow?.created_by && groupRow.created_by !== user.id) {
          await supabase.from("notifications").insert({
            user_id: groupRow.created_by,
            actor_id: user.id,
            type: "group_join",
            group_id: groupId,
            metadata: { group_slug: groupRow.slug, group_name: groupRow.name },
          });
        }

        router.refresh();
      }
    }

    setLoading(false);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!groupId || loading}
      className={`${isMember ? "button-secondary" : "button-primary"} ${className}`.trim()}
    >
      {loading ? "Saving..." : isMember ? "Joined" : "Join Group"}
    </button>
  );
}
