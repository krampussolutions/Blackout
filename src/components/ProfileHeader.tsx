import type { MemberProfile } from "@/lib/site";
import FollowButton from "@/components/FollowButton";

type ProfileHeaderProps = {
  profile: MemberProfile;
};

export default function ProfileHeader({ profile }: ProfileHeaderProps) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-border bg-panel shadow-sm">
      <div className={`h-40 bg-gradient-to-r ${profile.cover}`} />
      <div className="px-6 pb-6">
        <div className="-mt-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex items-end gap-4">
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl border-4 border-panel bg-panelSoft text-2xl font-bold text-text">
              {profile.avatar}
            </div>
            <div className="pb-1">
              <h1 className="text-3xl font-bold text-text">{profile.displayName}</h1>
              <p className="mt-1 text-sm text-muted">@{profile.username} • {profile.location}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button type="button" className="button-secondary">Message</button>
            <FollowButton
              targetUserId={profile.id}
              targetUsername={profile.username}
              initialIsFollowing={profile.isFollowing}
              disabled={profile.isCurrentUser}
            />
          </div>
        </div>

        <p className="mt-5 max-w-3xl text-sm leading-6 text-muted">{profile.bio}</p>

        <div className="mt-5 grid gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-border bg-panelSoft p-4">
            <div className="text-2xl font-bold text-text">{profile.posts}</div>
            <div className="mt-1 text-xs uppercase tracking-[0.18em] text-muted">Posts</div>
          </div>
          <div className="rounded-2xl border border-border bg-panelSoft p-4">
            <div className="text-2xl font-bold text-text">{profile.followers}</div>
            <div className="mt-1 text-xs uppercase tracking-[0.18em] text-muted">Followers</div>
          </div>
          <div className="rounded-2xl border border-border bg-panelSoft p-4">
            <div className="text-2xl font-bold text-text">{profile.following}</div>
            <div className="mt-1 text-xs uppercase tracking-[0.18em] text-muted">Following</div>
          </div>
          <div className="rounded-2xl border border-border bg-panelSoft p-4">
            <div className="text-sm font-semibold text-text">{profile.joinedLabel}</div>
            <div className="mt-1 text-xs uppercase tracking-[0.18em] text-muted">Member Since</div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {profile.interests.map((interest) => (
            <span key={interest} className="rounded-full border border-border bg-panelSoft px-3 py-2 text-xs text-muted">
              {interest}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
