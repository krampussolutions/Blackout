"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { INVITE_ANNOUNCEMENT_VERSION } from "@/lib/referrals";

type InviteAnnouncementModalProps = {
  userId: string;
  displayName: string;
  successfulInvites: number;
  founderBadgeEarned: boolean;
  founderBadgeTarget: number;
};

export default function InviteAnnouncementModal({
  userId,
  displayName,
  successfulInvites,
  founderBadgeEarned,
  founderBadgeTarget,
}: InviteAnnouncementModalProps) {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [open, setOpen] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const invitesRemaining = Math.max(founderBadgeTarget - successfulInvites, 0);

  async function markSeen(nextHref?: string) {
    if (saving) return;

    setSaving(true);
    setError(null);

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ invite_announcement_seen_version: INVITE_ANNOUNCEMENT_VERSION })
      .eq("id", userId);

    if (updateError) {
      setError(updateError.message);
      setSaving(false);
      return;
    }

    setOpen(false);
    setSaving(false);
    router.refresh();

    if (nextHref) {
      router.push(nextHref);
    }
  }

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/75 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-3xl border border-border bg-background p-6 shadow-2xl md:p-7">
        <p className="text-xs uppercase tracking-[0.22em] text-brand">New invite system</p>
        <h2 className="mt-3 text-2xl font-bold text-text md:text-3xl">
          Invites now unlock the Founder badge
        </h2>
        <p className="mt-3 text-sm leading-6 text-muted md:text-base">
          {displayName}, your personal invite link is now live on Blackout Network. When people create an account through your link, those signups count toward your invite total.
        </p>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-border bg-panelSoft p-4">
            <div className="text-xs uppercase tracking-[0.18em] text-muted">Founder goal</div>
            <div className="mt-2 text-lg font-semibold text-text">{founderBadgeTarget} successful signups</div>
          </div>
          <div className="rounded-2xl border border-border bg-panelSoft p-4">
            <div className="text-xs uppercase tracking-[0.18em] text-muted">Your progress</div>
            <div className="mt-2 text-lg font-semibold text-text">{successfulInvites} counted</div>
          </div>
          <div className="rounded-2xl border border-border bg-panelSoft p-4">
            <div className="text-xs uppercase tracking-[0.18em] text-muted">Status</div>
            <div className="mt-2 text-lg font-semibold text-text">
              {founderBadgeEarned
                ? "Founder unlocked"
                : invitesRemaining === 1
                  ? "1 more signup"
                  : `${invitesRemaining} more signups`}
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-brand/30 bg-brand/10 p-4 text-sm leading-6 text-text">
          <p>
            Hit {founderBadgeTarget} successful invite signups and your profile unlocks the <span className="font-semibold text-brand">Founder</span> badge.
          </p>
          <p className="mt-2 text-muted">
            As the network grows, invites may also be tied to future recognition, access, or community perks.
          </p>
        </div>

        {error ? (
          <p className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            className="button-primary"
            onClick={() => markSeen("/invite")}
            disabled={saving}
          >
            {saving ? "Saving..." : "Open invite page"}
          </button>
          <button
            type="button"
            className="button-secondary"
            onClick={() => markSeen()}
            disabled={saving}
          >
            {saving ? "Saving..." : "Got it"}
          </button>
        </div>
      </div>
    </div>
  );
}
