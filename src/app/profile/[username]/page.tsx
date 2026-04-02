import Link from "next/link";
import { notFound } from "next/navigation";
import PostCard from "@/components/PostCard";
import ProfileHeader from "@/components/ProfileHeader";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { type MemberProfile } from "@/lib/site";

type ProfilePageProps = {
  params: Promise<{ username: string }>;
};

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username: rawUsername } = await params;
  const username = rawUsername.trim().toLowerCase();

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: dbProfile, error: profileError } = await supabase
    .from("profiles")
    .select("id, username, display_name, bio, location, avatar_url, cover_url, interests, membership_tier, founder_badge_earned, created_at")
    .ilike("username", username)
    .maybeSingle();

  if (profileError) {
    console.error("Profile query error:", profileError);
  }

  let followerCount = 0;
  let followingCount = 0;
  let postCount = 0;
  let isFollowing = false;

  if (dbProfile?.id) {
    const [{ count: followers }, { count: following }, { count: posts }, { data: isFollowingRow }] = await Promise.all([
      supabase.from("follows").select("id", { count: "exact", head: true }).eq("following_id", dbProfile.id),
      supabase.from("follows").select("id", { count: "exact", head: true }).eq("follower_id", dbProfile.id),
      supabase.from("posts").select("id", { count: "exact", head: true }).eq("user_id", dbProfile.id),
      user && user.id !== dbProfile.id
        ? supabase.from("follows").select("id").eq("follower_id", user.id).eq("following_id", dbProfile.id).maybeSingle()
        : Promise.resolve({ data: null, error: null }),
    ]);
    followerCount = followers || 0;
    followingCount = following || 0;
    postCount = posts || 0;
    isFollowing = Boolean(isFollowingRow);
  }

  const profile: MemberProfile | null = dbProfile
    ? {
        id: dbProfile.id,
        username: dbProfile.username,
        displayName: dbProfile.display_name || dbProfile.username,
        bio: dbProfile.bio || "New Blackout Network member.",
        location: dbProfile.location || "Location not set",
        avatar: dbProfile.username.slice(0, 2).toUpperCase(),
        avatarUrl: dbProfile.avatar_url,
        cover: "from-slate-700 via-slate-800 to-zinc-950",
        coverUrl: dbProfile.cover_url,
        interests: dbProfile.interests?.length ? dbProfile.interests : ["Preparedness"],
        followers: followerCount,
        following: followingCount,
        posts: postCount,
        joinedLabel: dbProfile.created_at
          ? `Joined ${new Date(dbProfile.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}`
          : "Joined recently",
        isFollowing,
        isCurrentUser: user?.id === dbProfile.id,
        membershipTier: dbProfile.membership_tier,
        founderBadgeEarned: dbProfile.founder_badge_earned || false,
      }
    : null;

  if (!profile) {
    notFound();
  }

  let posts: Array<{
    id: string;
    title: string;
    category: string;
    author: string;
    authorDisplayName: string;
    excerpt: string;
    comments: number;
    likes: number;
    initialLiked: boolean;
    isOwner: boolean;
    groupName?: string;
    groupSlug?: string;
  }> = [];

  if (dbProfile?.id) {
    const [{ data: memberPosts }, { data: likeRows }, { data: commentRows }] = await Promise.all([
      supabase
        .from("posts")
        .select("id, title, content, created_at, categories(name), groups(name, slug), user_id")
        .eq("user_id", dbProfile.id)
        .order("created_at", { ascending: false })
        .limit(20),
      user ? supabase.from("likes").select("post_id").eq("user_id", user.id) : Promise.resolve({ data: [] as { post_id: string }[] }),
      supabase.from("comments").select("id, post_id").limit(500),
    ]);

    const likedPostIds = new Set((likeRows || []).map((row) => row.post_id));
    const commentCountByPost = new Map<string, number>();
    (commentRows || []).forEach((row: any) => {
      commentCountByPost.set(row.post_id, (commentCountByPost.get(row.post_id) || 0) + 1);
    });

    posts = (memberPosts || []).map((post) => {
      const category = Array.isArray(post.categories) ? post.categories[0] : post.categories;
      const group = Array.isArray(post.groups) ? post.groups[0] : post.groups;
      return {
        id: post.id,
        title: post.title,
        category: category?.name || "General Preparedness",
        author: profile.username,
        authorDisplayName: profile.displayName,
        excerpt: post.content,
        comments: commentCountByPost.get(post.id) || 0,
        likes: 0,
        initialLiked: likedPostIds.has(post.id),
        isOwner: user?.id === dbProfile.id,
        groupName: group?.name || undefined,
        groupSlug: group?.slug || undefined,
        postOwnerId: post.user_id,
      };
    });
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
            </div>

            <div className="card">
              <h2 className="text-lg font-semibold">Following</h2>
              <p className="mt-3 text-sm leading-6 text-muted">
                This member follows {profile.following} people and is followed by {profile.followers} members.
              </p>
              <div className="mt-4 flex flex-wrap gap-3 text-sm">
                <Link href={`/profile/${profile.username}/followers`} className="button-secondary">
                  View followers
                </Link>
                <Link href={`/profile/${profile.username}/following`} className="button-secondary">
                  View following
                </Link>
              </div>
            </div>
          </aside>

          <section className="space-y-4">
            <div className="card">
              <h2 className="text-lg font-semibold">Posts</h2>
              <p className="mt-2 text-sm text-muted">Recent activity from {profile.displayName}.</p>
            </div>

            {posts.length ? posts.map((post) => <PostCard key={post.id} {...post} />) : (
              <div className="card text-sm text-muted">No real posts yet.</div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
