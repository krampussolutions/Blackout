import Link from "next/link";
import type { Metadata } from "next";
import PostCard from "@/components/PostCard";
import PromptListCard from "@/components/PromptListCard";
import { COMMUNITY_PROMPTS, computeForYouScore, formatCommunityLabel, isActiveDiscussion } from "@/lib/community";
import { guides } from "@/lib/guides";
import { FOUNDER_BADGE_INVITE_TARGET } from "@/lib/referrals";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Blackout Network | Prepper Community for Blackouts, Off-Grid Living, and Emergency Readiness",
  description:
    "Join a preparedness community focused on blackouts, emergency planning, off-grid living, food storage, water, medical prep, and self-reliance.",
};

const FEATURED_GUIDE_SLUGS = [
  "72-hour-kit-checklist",
  "how-to-store-water",
  "family-emergency-comms-plan",
];

type HomePost = {
  id: string;
  title: string;
  category: string;
  author: string;
  authorDisplayName?: string;
  excerpt: string;
  comments: number;
  likes: number;
  initialLiked: boolean;
  isOwner: boolean;
  groupName?: string;
  groupSlug?: string;
  postOwnerId?: string;
  createdAt?: string;
};

type ActiveGroup = {
  slug: string;
  name: string;
  description: string;
  memberCount: number;
  postCount: number;
};

export default async function HomePage() {
  const supabase = await createSupabaseServerClient();

  const [{ data: dbPosts }, { data: dbGroups }] = await Promise.all([
    supabase
      .from("posts")
      .select(
        "id, title, content, created_at, user_id, groups(id, name, slug), categories(name, slug), profiles!posts_user_id_fkey(username, display_name)"
      )
      .order("created_at", { ascending: false })
      .limit(12),
    supabase.from("groups").select("id, name, slug, description").order("name"),
  ]);

  const posts: HomePost[] = dbPosts?.length
    ? await Promise.all(
        dbPosts.map(async (post) => {
          const author = Array.isArray(post.profiles) ? post.profiles[0] : post.profiles;
          const category = Array.isArray(post.categories) ? post.categories[0] : post.categories;
          const group = Array.isArray(post.groups) ? post.groups[0] : post.groups;

          const [{ count: likeCount }, { count: commentCount }] = await Promise.all([
            supabase.from("likes").select("id", { count: "exact", head: true }).eq("post_id", post.id),
            supabase.from("comments").select("id", { count: "exact", head: true }).eq("post_id", post.id),
          ]);

          return {
            id: post.id,
            title: post.title,
            category: formatCommunityLabel(category?.name || "General Preparedness"),
            author: author?.username || "member",
            authorDisplayName: author?.display_name || author?.username || "member",
            excerpt: post.content,
            comments: commentCount || 0,
            likes: likeCount || 0,
            initialLiked: false,
            isOwner: false,
            groupName: group?.name ? formatCommunityLabel(group.name) : undefined,
            groupSlug: group?.slug || undefined,
            postOwnerId: post.user_id,
            createdAt: post.created_at,
          };
        })
      )
    : [];

  const activePosts = posts
    .filter((post) => isActiveDiscussion(post, { minComments: 1, minLikes: 2 }))
    .sort((a, b) => computeForYouScore(b, false) - computeForYouScore(a, false))
    .slice(0, 4);

  const fallbackPosts = activePosts.length ? activePosts : posts.slice(0, 3);

  const activeGroups: ActiveGroup[] = dbGroups?.length
    ? (
        await Promise.all(
          dbGroups.map(async (group) => {
            const [{ count: memberCount }, { count: postCount }] = await Promise.all([
              supabase.from("group_members").select("id", { count: "exact", head: true }).eq("group_id", group.id),
              supabase.from("posts").select("id", { count: "exact", head: true }).eq("group_id", group.id),
            ]);

            return {
              slug: group.slug,
              name: formatCommunityLabel(group.name),
              description: group.description || "Preparedness group",
              memberCount: memberCount || 0,
              postCount: postCount || 0,
            };
          })
        )
      )
        .filter((group) => group.memberCount > 0 || group.postCount > 0)
        .sort((a, b) => b.postCount * 2 + b.memberCount - (a.postCount * 2 + a.memberCount))
        .slice(0, 4)
    : [];

  const featuredGuides = FEATURED_GUIDE_SLUGS.map((slug) => guides.find((guide) => guide.slug === slug)).filter(
    (guide): guide is NonNullable<(typeof guides)[number]> => Boolean(guide)
  );

  const stats = [
    { label: "Public guides", value: String(guides.length) },
    { label: "Active groups", value: String(activeGroups.length) },
    { label: "Live discussions", value: String(fallbackPosts.length) },
  ];

  return (
    <main className="container-shell py-8 md:py-10">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="space-y-6">
          <div className="card">
            <p className="text-xs uppercase tracking-[0.22em] text-muted">Preparedness community</p>
            <h1 className="mt-4 max-w-4xl text-3xl font-bold leading-tight md:text-4xl">
              Preparedness community for blackouts, emergencies, and off-grid living.
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-muted md:text-base">
              Join people sharing practical advice on food storage, backup power, water, medical prep,
              communications, and self-reliance. Learn, ask questions, and build your network before the next emergency.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/join" className="button-primary">
                Join Free
              </Link>
              <Link href="/guides" className="button-secondary">
                Explore Guides
              </Link>
            </div>
            <p className="mt-4 text-sm text-muted">
              No paid membership required. Join discussions, follow members, and build your preparedness network.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-border bg-panelSoft px-3 py-3 text-center">
                  <div className="text-lg font-bold text-text">{stat.value}</div>
                  <div className="mt-1 text-[11px] uppercase tracking-[0.14em] text-muted">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card border-brand/25 bg-gradient-to-br from-brand/10 via-panel to-panel">
            <p className="text-xs uppercase tracking-[0.22em] text-muted">Join early</p>
            <h2 className="mt-3 text-2xl font-bold text-text">Invite friends and unlock Founder status</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
              Invite {FOUNDER_BADGE_INVITE_TARGET} people who create accounts through your invite link and unlock the Founder badge.
              Early members may also unlock future recognition and perks as the network grows.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/invite" className="button-primary">
                Learn About Invites
              </Link>
              <Link href="/signup" className="button-secondary">
                Create Account
              </Link>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Practical discussions",
                body: "Get real tips on blackouts, storms, food storage, water, medical basics, and off-grid living.",
              },
              {
                title: "Preparedness guides",
                body: "Read public guides on kits, water storage, family communications, and household blackout planning.",
              },
              {
                title: "Build your circle",
                body: "Follow members, join groups, and connect with people who take preparedness seriously.",
              },
            ].map((item) => (
              <div key={item.title} className="card h-full bg-panelSoft">
                <h2 className="text-lg font-semibold text-text">{item.title}</h2>
                <p className="mt-3 text-sm leading-6 text-muted">{item.body}</p>
              </div>
            ))}
          </div>

          <div className="card">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-muted">Start here</p>
                <h2 className="mt-3 text-2xl font-bold">Featured guides for new members</h2>
                <p className="mt-2 text-sm leading-6 text-muted">
                  These are the best first reads for people getting serious about blackout prep and household readiness.
                </p>
              </div>
              <Link href="/guides" className="button-secondary">
                View All Guides
              </Link>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {featuredGuides.map((guide) => (
                <Link key={guide.slug} href={`/guides/${guide.slug}`} className="rounded-2xl border border-border bg-panelSoft px-5 py-5 transition hover:border-brand/40 hover:bg-panel">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted">Public guide</p>
                  <h3 className="mt-3 text-xl font-semibold text-text">{guide.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted">{guide.description}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-muted">Real activity</p>
                <h2 className="mt-3 text-2xl font-bold">Active discussions from the network</h2>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Only discussions with real engagement are featured here.
                </p>
              </div>
              <Link href="/feed" className="button-secondary">
                Open Feed
              </Link>
            </div>
          </div>

          {fallbackPosts.length ? (
            fallbackPosts.map((post) => <PostCard key={post.id} {...post} />)
          ) : (
            <div className="card text-sm text-muted">No real posts yet. Be the first to create one.</div>
          )}

          <div className="card">
            <h2 className="text-2xl font-bold text-text">Preparedness is better with a network</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">
              Whether you are building a first emergency kit or planning for long-term self-reliance,
              Blackout Network gives you a place to learn, share, and connect.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/signup" className="button-primary">
                Create Free Account
              </Link>
              <Link href="/feed" className="button-secondary">
                Browse the Community
              </Link>
            </div>
          </div>
        </section>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
          <div className="card">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">Popular groups</h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              Groups with real members or real discussion are surfaced first.
            </p>
            <div className="mt-4 space-y-3">
              {activeGroups.length ? (
                activeGroups.map((group) => (
                  <Link
                    key={group.slug}
                    href={`/groups/${group.slug}`}
                    className="block rounded-2xl border border-border bg-panelSoft px-4 py-4 transition hover:border-brand/40 hover:bg-panel"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-medium text-text">{group.name}</div>
                        <p className="mt-1 text-sm leading-6 text-muted">{group.description}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted">
                      {group.memberCount > 0 ? <span>{group.memberCount} members</span> : null}
                      {group.postCount > 0 ? <span>{group.postCount} posts</span> : null}
                    </div>
                  </Link>
                ))
              ) : (
                <div className="rounded-2xl bg-panelSoft px-4 py-4 text-sm text-muted">Groups will appear here once members start joining and posting.</div>
              )}
            </div>
          </div>

          <PromptListCard
            title="Need an idea for your first post?"
            description="Use a real prompt instead of filler. These are meant to spark actual member discussion."
            prompts={COMMUNITY_PROMPTS.slice(0, 4)}
          />
        </aside>
      </div>
    </main>
  );
}
