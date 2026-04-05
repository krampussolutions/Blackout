import Link from "next/link";
import MemberCard from "@/components/MemberCard";
import PostCard from "@/components/PostCard";
import { guides } from "@/lib/guides";
import { type MemberProfile } from "@/lib/site";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const stats = [
  { label: "Preparedness topics", value: "6+" },
  { label: "Starter groups", value: "8" },
  { label: "Guides to publish", value: "5" },
];

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
  founder_badge_earned?: boolean | null;
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
    joinedLabel: member.created_at
      ? `Joined ${new Date(member.created_at).toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        })}`
      : "Joined recently",
    isFollowing: member.isFollowing || false,
    isCurrentUser: member.isCurrentUser || false,
    founderBadgeEarned: member.founder_badge_earned || false,
  };
}

export default async function HomePage() {
  const supabase = await createSupabaseServerClient();

  const [{ data: dbPosts }, { data: dbMembers }, { data: dbCategories }, { data: dbGroups }] =
    await Promise.all([
      supabase
        .from("posts")
        .select(
          "id, title, content, created_at, user_id, groups(name, slug), categories(name, slug), profiles!posts_user_id_fkey(username, display_name)"
        )
        .order("created_at", { ascending: false })
        .limit(6),
      supabase
        .from("profiles")
        .select(
          "id, username, display_name, bio, location, avatar_url, cover_url, interests, founder_badge_earned, created_at"
        )
        .order("created_at", { ascending: false })
        .limit(4),
      supabase.from("categories").select("name, slug, description").order("name").limit(6),
      supabase.from("groups").select("name, slug, description").order("created_at", { ascending: false }).limit(4),
    ]);

  const posts = dbPosts?.length
    ? dbPosts.map((post) => {
        const author = Array.isArray(post.profiles) ? post.profiles[0] : post.profiles;
        const category = Array.isArray(post.categories) ? post.categories[0] : post.categories;
        const group = Array.isArray(post.groups) ? post.groups[0] : post.groups;
        return {
          id: post.id,
          title: post.title,
          category: category?.name || "General Preparedness",
          author: author?.username || "member",
          authorDisplayName: author?.display_name || author?.username || "member",
          excerpt: post.content,
          comments: 0,
          likes: 0,
          initialLiked: false,
          isOwner: false,
          groupName: group?.name || undefined,
          groupSlug: group?.slug || undefined,
          postOwnerId: post.user_id,
        };
      })
    : [];

  const members = (dbMembers || []).map((member) => formatMember(member));

  return (
    <main className="container-shell py-8 md:py-10">
      <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)_300px]">
        <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
          <div className="card">
            <p className="text-xs uppercase tracking-[0.22em] text-muted">Preparedness community</p>
            <h1 className="mt-4 text-3xl font-bold leading-tight">
              Join a network built for blackouts, outages, off-grid living, and self-reliance.
            </h1>
            <p className="mt-4 text-sm leading-6 text-muted">
              Blackout Network is a social platform for practical readiness. Join discussions, follow members,
              explore groups, and learn from people building real-world preparedness systems.
            </p>
            <div className="mt-5 grid gap-2">
              <Link href="/join" className="button-primary">Join Blackout Network</Link>
              <Link href="/feed" className="button-secondary">Explore the feed</Link>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-border bg-panelSoft px-3 py-3 text-center">
                  <div className="text-lg font-bold text-text">{stat.value}</div>
                  <div className="mt-1 text-[11px] uppercase tracking-[0.14em] text-muted">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">Why join</h2>
            <div className="mt-4 space-y-3 text-sm text-muted">
              <div className="rounded-xl bg-panelSoft px-3 py-3">
                Find practical posts on blackout prep, food storage, comms, water, and medical basics.
              </div>
              <div className="rounded-xl bg-panelSoft px-3 py-3">
                Connect with other members who are building resilient homes, families, and communities.
              </div>
              <div className="rounded-xl bg-panelSoft px-3 py-3">
                Explore groups and public guides without digging through noisy, general-purpose platforms.
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">Popular categories</h2>
            <div className="mt-4 space-y-3">
              {(dbCategories || []).length ? (dbCategories || []).map((category) => (
                <Link key={category.slug} href={`/feed?category=${category.slug}`} className="block rounded-xl bg-panelSoft px-3 py-3 transition hover:text-text">
                  <div className="font-medium text-text">{category.name}</div>
                  <p className="mt-1 text-xs leading-5 text-muted">{category.description}</p>
                </Link>
              )) : <div className="rounded-xl bg-panelSoft px-3 py-3 text-sm text-muted">No categories yet.</div>}
            </div>
          </div>
        </aside>

        <section className="min-w-0 space-y-4">
          <div className="card">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="max-w-2xl">
                <p className="text-xs uppercase tracking-[0.22em] text-muted">New to the network?</p>
                <h2 className="mt-3 text-2xl font-bold">Start with the feed, then build your profile and join groups.</h2>
                <p className="mt-3 text-sm leading-6 text-muted">
                  The fastest path is simple: create an account, add your interests, follow a few members,
                  and contribute one useful post or comment.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/signup" className="button-primary">Create account</Link>
                <Link href="/members" className="button-secondary">Browse members</Link>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {guides.slice(0, 2).map((guide) => (
              <Link key={guide.slug} href={`/guides/${guide.slug}`} className="card block transition hover:border-brand/40">
                <p className="text-xs uppercase tracking-[0.18em] text-muted">Public guide</p>
                <h3 className="mt-3 text-xl font-semibold">{guide.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{guide.description}</p>
              </Link>
            ))}
          </div>

          {posts.length ? posts.map((post) => (
            <PostCard key={post.id} {...post} />
          )) : (
            <div className="card text-sm text-muted">No real posts yet. Be the first to create one.</div>
          )}
        </section>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
          <div className="card">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">Suggested members</h2>
            <div className="mt-4 space-y-3">
              {members.length ? members.map((member) => (
                <MemberCard key={member.username} member={member} />
              )) : (
                <div className="text-sm text-muted">No real members yet.</div>
              )}
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">Suggested groups</h2>
              <Link href="/groups" className="text-xs text-muted hover:text-text">View all</Link>
            </div>
            <div className="mt-4 space-y-3">
              {(dbGroups || []).length ? (dbGroups || []).map((group) => (
                <Link key={group.slug} href={`/groups/${group.slug}`} className="block rounded-xl border border-border bg-panelSoft px-4 py-4 transition hover:border-brand/40">
                  <div className="font-medium text-text">{group.name}</div>
                  <p className="mt-1 text-xs leading-5 text-muted">{group.description}</p>
                </Link>
              )) : (
                <div className="text-sm text-muted">No groups yet.</div>
              )}
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">Start here</h2>
              <Link href="/guides" className="text-xs text-muted hover:text-text">All guides</Link>
            </div>
            <div className="mt-4 space-y-3">
              {guides.slice(0, 3).map((guide) => (
                <Link key={guide.slug} href={`/guides/${guide.slug}`} className="block rounded-xl bg-panelSoft px-3 py-3 transition hover:text-text">
                  <div className="font-medium text-text">{guide.title}</div>
                  <p className="mt-1 text-xs leading-5 text-muted">{guide.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
