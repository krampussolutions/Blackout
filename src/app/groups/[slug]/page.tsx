import Link from "next/link";
import { notFound } from "next/navigation";
import GroupJoinButton from "@/components/GroupJoinButton";
import MemberCard from "@/components/MemberCard";
import PostCard from "@/components/PostCard";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { type MemberProfile } from "@/lib/site";

function formatMember(member: {
  id: string;
  username: string;
  display_name?: string | null;
  bio?: string | null;
  location?: string | null;
  avatar_url?: string | null;
  cover_url?: string | null;
  interests?: string[] | null;
  created_at?: string | null;
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
    followers: 0,
    following: 0,
    posts: 0,
    joinedLabel: member.created_at ? `Joined ${new Date(member.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}` : "Joined recently",
    isFollowing: member.isFollowing || false,
    isCurrentUser: member.isCurrentUser || false,
  };
}

export default async function GroupDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: group } = await supabase
    .from("groups")
    .select("id, name, slug, description, created_by, created_at")
    .eq("slug", slug)
    .maybeSingle();

  if (!group) notFound();

  const [{ count: memberCount }, { data: myMembership }, { data: memberRows }, { data: followRows }, { data: likeRows }, { data: dbPosts }] = await Promise.all([
    supabase.from("group_members").select("id", { count: "exact", head: true }).eq("group_id", group.id),
    user ? supabase.from("group_members").select("id").eq("group_id", group.id).eq("user_id", user.id).maybeSingle() : Promise.resolve({ data: null }),
    supabase
      .from("group_members")
      .select("profiles!group_members_user_id_fkey(id, username, display_name, bio, location, avatar_url, cover_url, interests, created_at)")
      .eq("group_id", group.id)
      .limit(6),
    user ? supabase.from("follows").select("following_id").eq("follower_id", user.id) : Promise.resolve({ data: [] as { following_id: string }[] }),
    user ? supabase.from("likes").select("post_id").eq("user_id", user.id) : Promise.resolve({ data: [] as { post_id: string }[] }),
    supabase
      .from("posts")
      .select("id, title, content, created_at, user_id, groups(name, slug), categories(name), profiles!posts_user_id_fkey(username, display_name)")
      .eq("group_id", group.id)
      .order("created_at", { ascending: false })
      .limit(25),
  ]);

  const followingIds = new Set((followRows || []).map((row) => row.following_id));
  const likedPostIds = new Set((likeRows || []).map((row) => row.post_id));

  const members = (memberRows || [])
    .map((row) => (Array.isArray(row.profiles) ? row.profiles[0] : row.profiles))
    .filter(Boolean)
    .map((profile) =>
      formatMember({
        ...(profile as NonNullable<typeof profile>),
        isFollowing: followingIds.has((profile as NonNullable<typeof profile>).id),
        isCurrentUser: user?.id === (profile as NonNullable<typeof profile>).id,
      })
    );

  const posts = dbPosts && dbPosts.length > 0
    ? await Promise.all(
        dbPosts.map(async (post) => {
          const author = Array.isArray(post.profiles) ? post.profiles[0] : post.profiles;
          const category = Array.isArray(post.categories) ? post.categories[0] : post.categories;
          const groupRef = Array.isArray(post.groups) ? post.groups[0] : post.groups;
          const [{ count: likeCount }, { count: commentCount }] = await Promise.all([
            supabase.from("likes").select("id", { count: "exact", head: true }).eq("post_id", post.id),
            supabase.from("comments").select("id", { count: "exact", head: true }).eq("post_id", post.id),
          ]);
          return {
            id: post.id,
            title: post.title,
            category: category?.name || "General Preparedness",
            author: author?.username || "member",
            authorDisplayName: author?.display_name || author?.username || "member",
            excerpt: post.content,
            comments: commentCount || 0,
            likes: likeCount || 0,
            initialLiked: likedPostIds.has(post.id),
            isOwner: user?.id === post.user_id,
            groupName: groupRef?.name || group.name,
            groupSlug: groupRef?.slug || group.slug,
            postOwnerId: post.user_id,
          };
        })
      )
    : [];

  return (
    <main className="container-shell py-10">
      <div className="space-y-6">
        <div className="card">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.18em] text-muted">Group</div>
              <h1 className="mt-2 text-3xl font-bold">{group.name}</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">{group.description || "Preparedness group"}</p>
              <p className="mt-3 text-xs uppercase tracking-[0.18em] text-muted">{memberCount || 0} members</p>
            </div>
            <div className="flex gap-3">
              <Link href={`/posts/new?group=${group.slug}`} className="button-secondary">Post in Group</Link>
              <GroupJoinButton groupId={group.id} groupSlug={group.slug} initialIsMember={Boolean(myMembership)} />
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="space-y-4">
            <div className="card">
              <h2 className="text-lg font-semibold">Members</h2>
              <p className="mt-2 text-sm text-muted">People currently participating in this group.</p>
              <div className="mt-4 space-y-3">
                {members.length ? members.map((member) => (
                  <MemberCard key={member.username} member={member} compact />
                )) : <div className="rounded-xl bg-panelSoft px-3 py-3 text-sm text-muted">{(memberCount || 0) > 0 ? `${memberCount} member${memberCount === 1 ? "" : "s"} joined this group, but profile cards are not available yet.` : "No members yet."}</div>}
              </div>
            </div>
          </aside>

          <section className="space-y-4">
            <div className="card">
              <h2 className="text-lg font-semibold">Recent posts</h2>
              <p className="mt-2 text-sm text-muted">The latest preparedness discussion in {group.name}.</p>
            </div>
            {posts.length ? posts.map((post) => <PostCard key={post.id} {...post} />) : (
              <div className="card text-sm text-muted">No posts in this group yet.</div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
