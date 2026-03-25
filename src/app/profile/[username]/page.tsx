import { notFound } from "next/navigation";
import AdSlot from "@/components/AdSlot";
import PostCard from "@/components/PostCard";
import ProfileHeader from "@/components/ProfileHeader";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getMemberProfile, samplePosts, type MemberProfile } from "@/lib/site";

type ProfilePageProps = {
  params: Promise<{ username: string }>;
};

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username: rawUsername } = await params;
  const username = rawUsername.trim().toLowerCase();
  const sampleProfile = getMemberProfile(username);

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: dbProfile } = await supabase
    .from("profiles")
    .select("id, username, display_name, bio, location, created_at")
    .ilike("username", username)
    .maybeSingle();

  const [{ count: followerCount }, { count: followingCount }, { count: postCount }, { data: followRow }, { data: dbPosts }] = dbProfile?.id
    ? await Promise.all([
        supabase.from("follows").select("id", { count: "exact", head: true }).eq("following_id", dbProfile.id),
        supabase.from("follows").select("id", { count: "exact", head: true }).eq("follower_id", dbProfile.id),
        supabase.from("posts").select("id", { count: "exact", head: true }).eq("user_id", dbProfile.id),
        user ? supabase.from("follows").select("id").eq("follower_id", user.id).eq("following_id", dbProfile.id).maybeSingle() : Promise.resolve({ data: null }),
        supabase
          .from("posts")
          .select("id, title, content, created_at, categories(name)")
          .eq("user_id", dbProfile.id)
          .order("created_at", { ascending: false })
          .limit(10),
      ])
    : [{ count: 0 }, { count: 0 }, { count: 0 }, { data: null }, { data: null }];

  const profile: MemberProfile | null = dbProfile
    ? {
        id: dbProfile.id,
        username: dbProfile.username,
        displayName: dbProfile.display_name || dbProfile.username,
        bio: dbProfile.bio || "New Blackout Network member.",
        location: dbProfile.location || "Location not set",
        avatar: dbProfile.username.slice(0, 2).toUpperCase(),
        cover: sampleProfile?.cover || "from-slate-700 via-slate-800 to-zinc-950",
        interests: sampleProfile?.interests || ["Preparedness"],
        followers: followerCount || 0,
        following: followingCount || 0,
        posts: postCount || 0,
        joinedLabel: dbProfile.created_at
          ? `Joined ${new Date(dbProfile.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}`
          : "Joined recently",
        isFollowing: Boolean(followRow),
        isCurrentUser: user?.id === dbProfile.id,
      }
    : sampleProfile ?? null;

  if (!profile) {
    notFound();
  }

  let posts = samplePosts.filter((post) => post.author.toLowerCase() === username);

  if (dbPosts && dbPosts.length > 0) {
    posts = dbPosts.map((post) => ({
      id: post.id,
      title: post.title,
      category: (Array.isArray(post.categories) ? post.categories[0]?.name : (post.categories as { name?: string } | null)?.name) || "General Preparedness",
      author: profile.username,
      excerpt: post.content,
      comments: 0,
      likes: 0,
    }));
  }

  return (
    <main className="container-shell py-10">
      <div className="space-y-6">
        <ProfileHeader profile={profile} />

        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="space-y-4">
            <div className="card">
              <h2 className="text-lg font-semibold">About</h2>
              <p className="mt-3 text-sm leading-6 text-muted">{profile.bio}</p>
              <div className="mt-4 text-sm text-muted">{profile.location}</div>
              <div className="mt-2 text-sm text-muted">{profile.joinedLabel}</div>

            <AdSlot label="Sponsored" />
          </div>

            <div className="card">
              <h2 className="text-lg font-semibold">Following</h2>
              <p className="mt-3 text-sm leading-6 text-muted">
                This member follows {profile.following} people and is followed by {profile.followers} members.
              </p>
            </div>
          </aside>

          <section className="space-y-4">
            <div className="card">
              <h2 className="text-lg font-semibold">Posts</h2>
              <p className="mt-2 text-sm text-muted">Recent activity from {profile.displayName}.</p>
            </div>

            {posts.length ? posts.map((post, index) => (
              <div key={post.id} className="space-y-4">
                <PostCard {...post} />
                {index === 1 ? <AdSlot label="Recommended" /> : null}
              </div>
            )) : (
              <div className="card text-sm text-muted">No posts yet.</div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
