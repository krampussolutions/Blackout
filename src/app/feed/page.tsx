import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import MemberCard from "@/components/MemberCard";
import PostCard from "@/components/PostCard";
import { categories, rightRailTopics, samplePosts, memberProfiles, type MemberProfile } from "@/lib/site";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function formatMember(member: {
  id?: string;
  username: string;
  display_name?: string | null;
  bio?: string | null;
  location?: string | null;
  avatar_url?: string | null;
  cover_url?: string | null;
  interests?: string[] | null;
  created_at?: string | null;
  followers?: number;
  following?: number;
  posts?: number;
  isFollowing?: boolean;
  isCurrentUser?: boolean;
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
    followers: member.followers || 0,
    following: member.following || 0,
    posts: member.posts || 0,
    joinedLabel: member.created_at ? `Joined ${new Date(member.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}` : "Joined recently",
    isFollowing: member.isFollowing || false,
    isCurrentUser: member.isCurrentUser || false,
  };
}

export default async function FeedPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: dbPosts }, { data: dbMembers }, { data: followRows }] = await Promise.all([
    supabase
      .from("posts")
      .select("id, title, content, created_at, categories(name), profiles!posts_user_id_fkey(username, display_name)")
      .order("created_at", { ascending: false })
      .limit(25),
    supabase
      .from("profiles")
      .select("id, username, display_name, bio, location, avatar_url, cover_url, interests, created_at")
      .order("created_at", { ascending: false })
      .limit(8),
    user
      ? supabase.from("follows").select("following_id").eq("follower_id", user.id)
      : Promise.resolve({ data: [] as { following_id: string }[] }),
  ]);

  const followingIds = new Set((followRows || []).map((row) => row.following_id));

  const posts = dbPosts && dbPosts.length > 0
    ? dbPosts.map((post) => {
        const author = Array.isArray(post.profiles) ? post.profiles[0] : post.profiles;
        const category = Array.isArray(post.categories) ? post.categories[0] : post.categories;
        return {
          id: post.id,
          title: post.title,
          category: category?.name || "General Preparedness",
          author: author?.username || "member",
          excerpt: post.content,
          comments: 0,
          likes: 0,
        };
      })
    : samplePosts;

  const dynamicMembers = (dbMembers || []).map((member) => formatMember({
    ...member,
    isFollowing: followingIds.has(member.id),
    isCurrentUser: user?.id === member.id,
  }));

  const shownMembers = dynamicMembers.length > 0 ? dynamicMembers : memberProfiles;
  const followedMembers = shownMembers.filter((member) => member.isFollowing);
  const suggestedMembers = shownMembers.filter((member) => !member.isFollowing && !member.isCurrentUser).slice(0, 5);

  return (
    <main className="container-shell py-8 md:py-10">
      <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)_280px]">
        <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
          <div className="card">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">Browse</h2>
            <div className="mt-4 space-y-2 text-sm">
              <div className="rounded-xl bg-panelSoft px-3 py-3 text-text">For You</div>
              <div className="rounded-xl bg-panelSoft px-3 py-3 text-muted">Latest</div>
              <div className="rounded-xl bg-panelSoft px-3 py-3 text-muted">Following</div>
              <div className="rounded-xl bg-panelSoft px-3 py-3 text-muted">Saved</div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">Following</h2>
            <div className="mt-4 space-y-3">
              {followedMembers.length ? followedMembers.slice(0, 4).map((member) => (
                <Link key={member.username} href={`/profile/${member.username}`} className="block rounded-xl bg-panelSoft px-3 py-3 text-sm text-muted transition hover:text-text">
                  <div className="font-medium text-text">{member.displayName}</div>
                  <div className="text-xs text-muted">@{member.username}</div>
                </Link>
              )) : <div className="rounded-xl bg-panelSoft px-3 py-3 text-sm text-muted">Follow a few members to build your network.</div>}
            </div>
          </div>

          <div className="card">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">Categories</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {categories.slice(0, 6).map((category) => (
                <span key={category.slug} className="rounded-full border border-border bg-panelSoft px-3 py-2 text-xs text-muted">{category.name}</span>
              ))}
            </div>
          </div>
        </aside>

        <section className="space-y-4">
          <div className="card">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold">Home feed</h1>
                <p className="mt-2 text-sm text-muted">The latest preparedness posts from across the network.</p>
              </div>
              <Link href="/posts/new" className="button-primary">Create Post</Link>
            </div>
          </div>

          <AdSlot title="Sponsored" variant="wide" />

          {posts.map((post, index) => (
            <div key={post.id} className="space-y-4">
              <PostCard {...post} />
              {index === 1 ? <AdSlot title="Sponsored" variant="wide" /> : null}
            </div>
          ))}
        </section>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
          <div className="card">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">Suggested Members</h2>
            <div className="mt-4 space-y-3">
              {suggestedMembers.map((member) => <MemberCard key={member.username} member={member} compact />)}
            </div>
          </div>

          <AdSlot title="Sponsored" variant="sidebar" />

          <div className="card">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">Trending Topics</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {rightRailTopics.map((topic) => (
                <span key={topic} className="rounded-full border border-border bg-panelSoft px-3 py-2 text-xs text-muted">#{topic}</span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
