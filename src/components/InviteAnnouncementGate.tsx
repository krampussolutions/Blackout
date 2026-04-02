import { createSupabaseServerClient } from "@/lib/supabase/server";
import InviteAnnouncementModal from "@/components/InviteAnnouncementModal";
import {
  FOUNDER_BADGE_INVITE_TARGET,
  INVITE_ANNOUNCEMENT_VERSION,
} from "@/lib/referrals";

export default async function InviteAnnouncementGate() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const [{ data: profile }, { count: inviteCount }] = await Promise.all([
    supabase
      .from("profiles")
      .select(
        "display_name, username, founder_badge_earned, invite_announcement_seen_version"
      )
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("invited_by", user.id),
  ]);

  if (!profile) {
    return null;
  }

  const seenVersion = profile.invite_announcement_seen_version ?? 0;
  if (seenVersion >= INVITE_ANNOUNCEMENT_VERSION) {
    return null;
  }

  return (
    <InviteAnnouncementModal
      userId={user.id}
      displayName={profile.display_name || profile.username || "member"}
      successfulInvites={inviteCount ?? 0}
      founderBadgeEarned={profile.founder_badge_earned ?? false}
      founderBadgeTarget={FOUNDER_BADGE_INVITE_TARGET}
    />
  );
}
