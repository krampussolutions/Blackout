"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type AdminMemberActionsProps = {
  memberId: string;
  username: string;
  membershipTier: string | null;
  isCurrentAdmin?: boolean;
};

export default function AdminMemberActions({
  memberId,
  username,
  membershipTier,
  isCurrentAdmin = false,
}: AdminMemberActionsProps) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function setTier(nextTier: "free" | "admin") {
    if (loading || (isCurrentAdmin && nextTier === "free")) return;
    setLoading(true);

    const { error } = await supabase
      .from("profiles")
      .update({ membership_tier: nextTier })
      .eq("id", memberId);

    setLoading(false);

    if (error) {
      window.alert(error.message);
      return;
    }

    router.refresh();
  }

  async function removeUser() {
    if (loading || isCurrentAdmin) return;
    const confirmed = window.confirm(`Remove @${username} from Blackout Network? This deletes their account, profile, posts, likes, and follows.`);
    if (!confirmed) return;

    setLoading(true);
    const response = await fetch(`/api/admin/users/${memberId}`, { method: "DELETE" });
    const result = await response.json().catch(() => ({}));
    setLoading(false);

    if (!response.ok) {
      window.alert(result.error || "Could not remove user.");
      return;
    }

    router.refresh();
  }

  return (
    <div className="flex flex-wrap gap-2">
      {membershipTier === "admin" ? (
        <button
          type="button"
          className="rounded-xl border border-border bg-panelSoft px-3 py-2 text-xs font-semibold text-text disabled:opacity-60"
          onClick={() => setTier("free")}
          disabled={loading || isCurrentAdmin}
          title={isCurrentAdmin ? "You cannot demote yourself here." : `Demote ${username} to free`}
        >
          {loading ? "Saving..." : "Demote admin"}
        </button>
      ) : (
        <button
          type="button"
          className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-200 disabled:opacity-60"
          onClick={() => setTier("admin")}
          disabled={loading}
        >
          {loading ? "Saving..." : "Promote admin"}
        </button>
      )}

      <button
        type="button"
        className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-200 disabled:opacity-60"
        onClick={removeUser}
        disabled={loading || isCurrentAdmin}
        title={isCurrentAdmin ? "You cannot remove your own account here." : `Remove ${username}`}
      >
        {loading ? "Working..." : "Remove user"}
      </button>
    </div>
  );
}
