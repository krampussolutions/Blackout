import Link from "next/link";
import type { MemberProfile } from "@/lib/site";
import FollowButton from "@/components/FollowButton";

type MemberCardProps = {
  member: MemberProfile;
  compact?: boolean;
};

export default function MemberCard({ member, compact = false }: MemberCardProps) {
  return (
    <div className={compact ? "rounded-2xl border border-border bg-panelSoft p-4" : "rounded-2xl border border-border bg-panelSoft p-4"}>
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-panel text-sm font-semibold text-text">
          {member.avatar}
        </div>
        <div className="min-w-0 flex-1">
          <Link href={`/profile/${member.username}`} className="block font-semibold text-text hover:underline">
            {member.displayName}
          </Link>
          <p className="text-sm text-muted">@{member.username}</p>
          <p className="mt-2 text-sm leading-6 text-muted">{member.bio}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {member.interests.map((interest) => (
              <span key={interest} className="rounded-full border border-border px-3 py-1 text-xs text-muted">
                {interest}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3 text-xs text-muted">
        <span>{member.followers} followers</span>
        <FollowButton
          targetUserId={member.id}
          targetUsername={member.username}
          initialIsFollowing={member.isFollowing}
          disabled={member.isCurrentUser}
        />
      </div>
    </div>
  );
}
