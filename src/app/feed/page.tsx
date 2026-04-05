import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import MemberCard from "@/components/MemberCard";
import PostCard from "@/components/PostCard";
import { type MemberProfile } from "@/lib/site";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type FeedPageProps = {
  searchParams?: Promise<{
    view?: string;
    category?: string;
    topic?: string;
  }>;
};

type FeedPost = {
  id: string;
  title: string;
  category: string;
  categorySlug?: string;
  author: string;
  authorDisplayName: string;
  excerpt: string;
  comments: number;
  likes: number;
  initialLiked: boolean;
  isOwner: boolean;
  groupName?: string;
  groupSlug?: string;
  authorId: string;
  createdAt: string;
};

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

function buildFeedHref(view: string, category?: string, topic?: string) {
  const params = new URLSearchParams();
  if (view && view !== "for-you") params.set("view", view);
  if (category) params.set("category", category);
  if (topic) params.set("topic", topic);
  const query = params.toString();
  return query ? `/feed?${query}` : "/feed";
}

function getFeedHeading(view: string, categoryName?: string, topic?: string) {
  if (categoryName) {
    return {
      title: categoryName,
      description: `Posts currently tagged in ${categoryName}.`,
    };
  }

  if (topic) {
    return {
      title: `#${topic}`,
      description: `Posts matching the trending topic #${topic}.`,
    };
  }

  switch (view) {
    case "latest":
      return {
        title: "Latest posts",
        description:
          "The most recent preparedness posts from across the network.",
      };
    case "following":
      return {
        title: "Following",
        description: "Fresh posts from members you follow.",
      };
    case "saved":
      return {
        title: "Saved",
        description:
          "Posts you have liked so you can come back to them quickly.",
      };
    default:
      return {
        title: "Home feed",
        description: "The latest preparedness posts from across the network.",
      };
  }
}

export default async function FeedPage({ searchParams }: FeedPageProps) {
  const params = (await searchParams) ?? {};
  const activeView = ["for-you", "latest", "following", "saved"].includes(
    (params.view || "").toLowerCase()
  )
    ? (params.view || "for-you").toLowerCase()
    : "for-you";
  const activeCategory = params.category?.toLowerCase();
  const activeTopic = params.topic?.toLowerCase();

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [
    { data: dbPosts },
    { data: dbMembers },
    { data: followRows },
    { data: likeRows },
    { data: dbCategories },
    { data: dbGroups },
  ] = await Promise.all([
    supabase
      .from("posts")
      .select(
        "id, title, content, created_at, user_id, groups(name, slug), categories(name, slug), profiles!posts_user_id_fkey(username, display_name)"
      )
      .order("created_at", { ascending: false })
      .limit(40),
    supabase
      .from("profiles")
      .select(
        "id, username, display_name, bio, location, avatar_url, cover_url, interests, founder_badge_earned, created_at"
      )
      .order("created_at", { ascending: false })
      .limit(8),
    user
      ? supabase.from("follows").select("following_id").eq("follower_id", user.id)
      : Promise.resolve({ data: [] as { following_id: string }[] }),
    user
      ? supabase.from("likes").select("post_id").eq("user_id", user.id)
      : Promise.resolve({ data: [] as { post_id: string }[] }),
    supabase.from("categories").select("name, slug").order("name"),
    supabase
      .from("groups")
      .select("name, slug")
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  const followingIds = new Set((followRows || []).map((row) => row.following_id));
  const likedPostIds = new Set((likeRows || []).map((row) => row.post_id));

  const posts: FeedPost[] =
    dbPosts && dbPosts.length > 0
      ? await Promise.all(
          dbPosts.map(async (post) => {
            const author = Array.isArray(post.profiles)
              ? post.profiles[0]
              : post.profiles;
            const category = Array.isArray(post.categories)
              ? post.categories[0]
              : post.categories;
            const group = Array.isArray(post.groups)
              ? post.groups[0]
              : post.groups;

            const [{ count: likeCount }, { count: commentCount }] =
              await Promise.all([
                supabase
                  .from("likes")
                  .select("id", { count: "exact", head: true })
                  .eq("post_id", post.id),
                supabase
                  .from("comments")
                  .select("id", { count: "exact", head: true })
                  .eq("post_id", post.id),
              ]);

            return {
              id: post.id,
              title: post.title,
              category: category?.name || "General Preparedness",
              categorySlug: category?.slug || undefined,
              author: author?.username || "member",
              authorDisplayName:
                author?.display_name || author?.username || "member",
              excerpt: post.content,
              comments: commentCount || 0,
              likes: likeCount || 0,
              initialLiked: likedPostIds.has(post.id),
              postAuthorId: post.user_id,
              isOwner: user?.id === post.user_id,
              groupName: group?.name || undefined,
              groupSlug: group?.slug || undefined,
              authorId: post.user_id,
              createdAt: post.created_at,
            };
          })
        )
      : [];

  const categoryCounts = new Map<
    string,
    { name: string; slug: string; count: number }
  >();

  posts.forEach((post) => {
    const slug =
      post.categorySlug ||
      post.category
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    const existing = categoryCounts.get(slug);
    if (existing) {
      existing.count += 1;
    } else {
      categoryCounts.set(slug, { name: post.category, slug, count: 1 });
    }
  });

  const categories = (dbCategories || [])
    .map((category) => ({
      ...category,
      count: categoryCounts.get(category.slug)?.count || 0,
    }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

  const suggestedGroups = (dbGroups || [])
    .map((group) => ({
      label: group.name,
      slug: group.slug,
      href: `/groups/${group.slug}`,
      count: posts.filter((post) => post.groupSlug === group.slug).length,
    }))
    .filter((group) => group.count > 0);

  const topCategories = [...categoryCounts.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
    .map((category) => ({
      label: category.name,
      href: buildFeedHref("for-you", category.slug),
      count: category.count,
    }));

  const interestTopics = (dbMembers || [])
    .flatMap((member) => member.interests || [])
    .reduce((acc, interest) => {
      const normalized = interest.toLowerCase();
      acc.set(normalized, (acc.get(normalized) || 0) + 1);
      return acc;
    }, new Map<string, number>());

  const interestTopicLinks = [...interestTopics.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([interest, count]) => ({
      label: interest,
      href: buildFeedHref("for-you", undefined, interest),
      count,
    }));

  const trendingTopics = [
    ...topCategories,
    ...suggestedGroups,
    ...interestTopicLinks,
  ].slice(0, 6);

  let filteredPosts = posts;

  if (activeCategory) {
    filteredPosts = filteredPosts.filter(
      (post) => post.categorySlug === activeCategory
    );
  }

  if (activeTopic) {
    filteredPosts = filteredPosts.filter((post) => {
      const haystack =
        `${post.title} ${post.excerpt} ${post.category} ${post.groupName || ""}`.toLowerCase();
      return haystack.includes(activeTopic);
    });
  }

  switch (activeView) {
    case "following":
      filteredPosts = user
        ? filteredPosts.filter(
            (post) => post.authorId && followingIds.has(post.authorId)
          )
        : [];
      break;
    case "saved":
      filteredPosts = user
        ? filteredPosts.filter((post) => likedPostIds.has(post.id))
        : [];
      break;
    case "latest":
    case "for-you":
    default:
      break;
  }

  const dynamicMembers = (dbMembers || []).map((member) =>
    formatMember({
      ...member,
      isFollowing: followingIds.has(member.id),
      isCurrentUser: user?.id === member.id,
    })
  );

  const shownMembers = dynamicMembers;
  const followedMembers = shownMembers.filter((member) => member.isFollowing);
  const suggestedMembers = shownMembers
    .filter((member) => !member.isFollowing && !member.isCurrentUser)
    .slice(0, 5);
  const currentMember = shownMembers.find((member) => member.isCurrentUser);

  const feedHeading = getFeedHeading(
    activeView,
    categories.find((category) => category.slug === activeCategory)?.name,
    activeTopic
  );

  const browseLinks = [
    {
      key: "for-you",
      label: "For You",
      href: buildFeedHref("for-you", activeCategory, activeTopic),
    },
    {
      key: "latest",
      label: "Latest",
      href: buildFeedHref("latest", activeCategory, activeTopic),
    },
    {
      key: "following",
      label: "Following",
      href: buildFeedHref("following", activeCategory, activeTopic),
    },
    {
      key: "saved",
      label: "Saved",
      href: buildFeedHref("saved", activeCategory, activeTopic),
    },
  ];

  return (
    <main className="container-shell py-8 md:py-10">
      <div className="relative grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)_280px]">
        <aside className="relative z-20 space-y-4 lg:sticky lg:top-24 lg:h-fit">
          <div className="card">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
              Browse
            </h2>
            <div className="mt-4 space-y-2 text-sm">
              {browseLinks.map((item) => {
                const isActive = activeView === item.key;
                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    className={`block rounded-xl px-3 py-3 transition ${
                      isActive
                        ? "bg-panelSoft text-text"
                        : "bg-panelSoft/60 text-muted hover:bg-panelSoft hover:text-text"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
                Following
              </h2>
              <Link
                href={
                  user && currentMember
                    ? `/profile/${currentMember.username}/following`
                    : "/members"
                }
                className="text-xs text-muted hover:text-text"
              >
                View all
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              {followedMembers.length ? (
                followedMembers.slice(0, 4).map((member) => (
                  <Link
                    key={member.username}
                    href={`/profile/${member.username}`}
                    className="block rounded-xl bg-panelSoft px-3 py-3 text-sm text-muted transition hover:text-text"
                  >
                    <div className="font-medium text-text">{member.displayName}</div>
                    <div className="text-xs text-muted">@{member.username}</div>
                  </Link>
                ))
              ) : (
                <div className="rounded-xl bg-panelSoft px-3 py-3 text-sm text-muted">
                  Follow a few members to build your network.
                </div>
              )}
            </div>
          </div>

          <div className="card relative z-20">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
                Categories
              </h2>
              {activeCategory || activeTopic ? (
                <Link
                  href={buildFeedHref(activeView)}
                  className="relative z-20 text-xs text-muted hover:text-text"
                >
                  Clear
                </Link>
              ) : null}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {categories.length ? (
                categories.slice(0, 8).map((category) => {
                  const isActive = activeCategory === category.slug;
                  return (
                    <Link
                      key={category.slug}
                      href={buildFeedHref(activeView, category.slug)}
                      className={`relative z-20 inline-flex rounded-full border px-3 py-2 text-xs transition pointer-events-auto ${
                        isActive
                          ? "border-brand bg-brand/20 text-brand"
                          : "border-border bg-panelSoft text-muted hover:border-brand/40 hover:bg-panel hover:text-text"
                      }`}
                    >
                      {category.name}
                      <span className="ml-1 opacity-70">{category.count}</span>
                    </Link>
                  );
                })
              ) : (
                <div className="text-sm text-muted">No categories yet.</div>
              )}
            </div>
          </div>
        </aside>

        <section className="relative z-0 space-y-4">
          <div className="card">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold">{feedHeading.title}</h1>
                <p className="mt-2 text-sm text-muted">
                  {feedHeading.description}
                </p>
              </div>
              <Link
                href={
                  activeCategory
                    ? `/posts/new?group=&category=${activeCategory}`
                    : "/posts/new"
                }
                className="button-primary"
              >
                Create Post
              </Link>
            </div>
          </div>

          <AdSlot title="Sponsored" variant="wide" />

          {filteredPosts.length ? (
            filteredPosts.map((post, index) => (
              <div key={post.id} className="space-y-4">
                <PostCard {...post} />
                {index === 1 ? <AdSlot title="Sponsored" variant="wide" /> : null}
              </div>
            ))
          ) : (
            <div className="card text-sm text-muted">
              No real posts yet. Be the first to create one.
            </div>
          )}
        </section>

        <aside className="relative z-20 space-y-4 lg:sticky lg:top-24 lg:h-fit">
          <div className="card">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
              Suggested Members
            </h2>
            <div className="mt-4 space-y-3">
              {suggestedMembers.length ? (
                suggestedMembers.map((member) => (
                  <MemberCard key={member.username} member={member} compact />
                ))
              ) : (
                <div className="text-sm text-muted">
                  No member suggestions yet.
                </div>
              )}
            </div>
          </div>

          <div className="card relative z-20">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
                Suggested Groups
              </h2>
              <Link
                href="/groups"
                className="relative z-20 text-xs text-muted hover:text-text"
              >
                View all
              </Link>
            </div>
            <div className="mt-4 space-y-2">
              {suggestedGroups.length ? (
                suggestedGroups.map((group) => (
                  <Link
                    key={group.slug}
                    href={group.href}
                    className="relative z-20 block rounded-xl border border-border bg-panelSoft px-3 py-3 transition pointer-events-auto hover:border-brand/40 hover:bg-panel"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-medium text-text">
                          {group.label}
                        </div>
                        <div className="mt-1 text-xs text-muted">
                          {group.count} posts
                        </div>
                      </div>
                      <span className="text-xs text-brand">View</span>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-sm text-muted">
                  No active groups to suggest yet.
                </div>
              )}
            </div>
          </div>

          <AdSlot title="Sponsored" variant="sidebar" />

          <div className="card">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
                Trending Topics
              </h2>
              {activeTopic || activeCategory ? (
                <Link
                  href={buildFeedHref(activeView)}
                  className="text-xs text-muted hover:text-text"
                >
                  Reset
                </Link>
              ) : null}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {trendingTopics.length ? (
                trendingTopics.map((topic) => (
                  <Link
                    key={`${topic.label}-${topic.href}`}
                    href={topic.href}
                    className="rounded-full border border-border bg-panelSoft px-3 py-2 text-xs text-muted transition hover:text-text"
                  >
                    #{topic.label.toLowerCase().replace(/\s+/g, "-")}{" "}
                    <span className="opacity-70">{topic.count}</span>
                  </Link>
                ))
              ) : (
                <div className="text-sm text-muted">
                  No trending topics yet.
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
