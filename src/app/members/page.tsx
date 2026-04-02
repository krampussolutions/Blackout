import MemberCard from "@/components/MemberCard";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { type MemberProfile } from "@/lib/site";

function toMemberProfile(member: {
  id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  location: string | null;
  avatar_url: string | null;
  cover_url: string | null;
  interests: string[] | null;
  created_at: string | null;
  founder_badge_earned?: boolean | null;
  followers: number;
  following: number;
  posts: number;
  isFollowing: boolean;
  isCurrentUser: boolean;
}): MemberProfile {
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
    followers: member.followers,
    following: member.following,
    posts: member.posts,
    joinedLabel: member.created_at ? `Joined ${new Date(member.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}` : "Joined recently",
    isFollowing: member.isFollowing,
    isCurrentUser: member.isCurrentUser,
    founderBadgeEarned: member.founder_badge_earned || false,
  };
}

export default async function MembersPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: profiles }, { data: follows }] = await Promise.all([
    supabase.from("profiles").select("id, username, display_name, bio, location, avatar_url, cover_url, interests, founder_badge_earned, created_at").order("created_at", { ascending: false }).limit(30),
    user ? supabase.from("follows").select("following_id").eq("follower_id", user.id) : Promise.resolve({ data: [] as { following_id: string }[] }),
  ]);

  const followingIds = new Set((follows || []).map((row) => row.following_id));

  const members = profiles?.length
    ? await Promise.all(profiles.map(async (profile) => {
        const [{ count: followers }, { count: following }, { count: posts }] = await Promise.all([
          supabase.from("follows").select("id", { count: "exact", head: true }).eq("following_id", profile.id),
          supabase.from("follows").select("id", { count: "exact", head: true }).eq("follower_id", profile.id),
          supabase.from("posts").select("id", { count: "exact", head: true }).eq("user_id", profile.id),
        ]);

        return toMemberProfile({
          ...profile,
          followers: followers || 0,
          following: following || 0,
          posts: posts || 0,
          isFollowing: followingIds.has(profile.id),
          isCurrentUser: user?.id === profile.id,
        });
      }))
    : [];

  return (
    <main className="container-shell py-12">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Members</h1>
          <p className="mt-2 text-muted">Find other preparedness-minded members, build your network, and follow people worth learning from.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {members.length ? members.map((member) => <MemberCard key={member.username} member={member} />) : (
            <div className="card text-sm text-muted md:col-span-2 xl:col-span-3">No real members to show yet.</div>
          )}
        </div>
      </div>
    </main>
  );
}
