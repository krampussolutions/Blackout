import Link from "next/link";
import { notFound } from "next/navigation";
import MemberCard from "@/components/MemberCard";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { MemberProfile } from "@/lib/site";

function mapProfile(member: any, currentUserId?: string): MemberProfile {
  return {
    id: member.id,
    username: member.username,
    displayName: member.display_name || member.username,
    bio: member.bio || "Preparedness-minded member.",
    location: member.location || "Location not set",
    avatar: member.username.slice(0, 2).toUpperCase(),
    avatarUrl: member.avatar_url,
    cover: "from-slate-700 via-slate-800 to-zinc-950",
    coverUrl: member.cover_url,
    interests: member.interests?.length ? member.interests : ["Preparedness"],
    followers: 0,
    following: 0,
    posts: 0,
    joinedLabel: member.created_at ? `Joined ${new Date(member.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}` : "Joined recently",
    founderBadgeEarned: member.founder_badge_earned || false,
    isFollowing: false,
    isCurrentUser: currentUserId === member.id,
  };
}

export default async function FollowingPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase.from("profiles").select("id, username, display_name").ilike("username", username).maybeSingle();
  if (!profile) notFound();

  const [{ data: rows }, { data: myFollows }] = await Promise.all([
    supabase
      .from("follows")
      .select("profiles!follows_following_id_fkey(id, username, display_name, bio, location, avatar_url, cover_url, interests, founder_badge_earned, created_at)")
      .eq("follower_id", profile.id),
    user ? supabase.from("follows").select("following_id").eq("follower_id", user.id) : Promise.resolve({ data: [] as { following_id: string }[] }),
  ]);

  const followingIds = new Set((myFollows || []).map((row) => row.following_id));
  const members = (rows || []).map((row: any) => {
    const member = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
    return { ...mapProfile(member, user?.id), isFollowing: followingIds.has(member.id) };
  });

  return (
    <main className="container-shell py-10">
      <div className="space-y-6">
        <div className="card">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold">Following</h1>
              <p className="mt-2 text-muted">People {profile.display_name || profile.username} follows.</p>
            </div>
            <Link href={`/profile/${profile.username}`} className="button-secondary">Back to Profile</Link>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {members.length ? members.map((member) => <MemberCard key={member.username} member={member} />) : <div className="card text-sm text-muted">Not following anyone yet.</div>}
        </div>
      </div>
    </main>
  );
}
