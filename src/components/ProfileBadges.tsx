type ProfileBadgesProps = {
  membershipTier?: string | null;
  founderBadgeEarned?: boolean;
  compact?: boolean;
};

export default function ProfileBadges({
  membershipTier,
  founderBadgeEarned = false,
  compact = false,
}: ProfileBadgesProps) {
  const baseClass = compact
    ? "inline-flex rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]"
    : "inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]";

  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {membershipTier === "admin" ? (
        <span className={`${baseClass} border-amber-500/30 bg-amber-500/10 text-amber-200`}>
          Admin
        </span>
      ) : null}

      {founderBadgeEarned ? (
        <span className={`${baseClass} border-brand/40 bg-brand/15 text-brand`}>
          Founder
        </span>
      ) : null}
    </div>
  );
}
