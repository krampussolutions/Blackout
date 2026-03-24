import Link from "next/link";
import MemberCard from "@/components/MemberCard";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { memberProfiles, type MemberProfile } from "@/lib/site";

function toMemberProfile(profile: {
  id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  location: string | null;
  created_at: string | null;
  isFollowing?: boolean;
  isCurrentUser?: boolean;
}): MemberProfile {
  return {
    id: profile.id,
    username: profile.username,
    displayName: profile.display_name || profile.username,
    bio: profile.bio || "Preparedness-minded member.",
    location: profile.location || "Location not set",
    avatar: profile.username.slice(0, 2).toUpperCase(),
    cover: "from-slate-700 via-slate-800 to-zinc-950",
    interests: ["Preparedness"],
    followers: 0,
    following: 0,
    posts: 0,
    joinedLabel: profile.created_at ? `Joined ${new Date(profile.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}` : "Joined recently",
    isFollowing: profile.isFollowing || false,
    isCurrentUser: profile.isCurrentUser || false,
  };
}

export default async function MembersPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const [{ data: profiles }, { data: followRows }] = await Promise.all([
    supabase.from("profiles").select("id, username, display_name, bio, location, created_at").order("created_at", { ascending: false }),
    user ? supabase.from("follows").select("following_id").eq("follower_id", user.id) : Promise.resolve({ data: [] as { following_id: string }[] }),
  ]);

  const followingIds = new Set((followRows || []).map((row) => row.following_id));
  const members = profiles && profiles.length > 0
    ? profiles.map((profile) => toMemberProfile({
        ...profile,
        isFollowing: followingIds.has(profile.id),
        isCurrentUser: user?.id === profile.id,
      }))
    : memberProfiles;

  return (
    <main className="container-shell py-10">
      <div className="space-y-6">
        <div className="card">
          <h1 className="text-3xl font-bold">Members</h1>
          <p className="mt-2 text-sm text-muted">
            Browse preparedness-minded members, visit their profiles, and build your network.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {members.map((member) => (
            <div key={member.username} className="card space-y-4">
              <MemberCard member={member} />
              <Link href={`/profile/${member.username}`} className="block rounded-xl border border-border bg-panelSoft px-4 py-3 text-center text-sm text-text transition hover:bg-black/20">
                View profile
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
