import Link from "next/link";
import { notFound } from "next/navigation";
import CommentSection from "@/components/CommentSection";
import LikeButton from "@/components/LikeButton";
import PostOwnerActions from "@/components/PostOwnerActions";
import ReportPostButton from "@/components/ReportPostButton";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: post }, { data: comments }, { count: likeCount }, { count: commentCount }, { data: likeRow }] = await Promise.all([
    supabase
      .from("posts")
      .select("id, title, content, created_at, user_id, groups(name, slug), categories(name), profiles!posts_user_id_fkey(username, display_name)")
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("comments")
      .select("id, user_id, content, created_at, profiles!comments_user_id_fkey(username, display_name)")
      .eq("post_id", id)
      .order("created_at", { ascending: true }),
    supabase.from("likes").select("id", { count: "exact", head: true }).eq("post_id", id),
    supabase.from("comments").select("id", { count: "exact", head: true }).eq("post_id", id),
    user ? supabase.from("likes").select("id").eq("post_id", id).eq("user_id", user.id).maybeSingle() : Promise.resolve({ data: null }),
  ]);

  if (!post) notFound();

  const commentIds = (comments || []).map((comment) => comment.id);
  const [{ data: commentLikeRows }, { data: commentLikedRows }] = commentIds.length
    ? await Promise.all([
        supabase.from("comment_likes").select("comment_id").in("comment_id", commentIds),
        user
          ? supabase
              .from("comment_likes")
              .select("comment_id")
              .eq("user_id", user.id)
              .in("comment_id", commentIds)
          : Promise.resolve({ data: [] as { comment_id: string }[] }),
      ])
    : [
        { data: [] as { comment_id: string }[] },
        { data: [] as { comment_id: string }[] },
      ];

  const commentLikeCounts = new Map<string, number>();
  for (const row of commentLikeRows || []) {
    commentLikeCounts.set(row.comment_id, (commentLikeCounts.get(row.comment_id) || 0) + 1);
  }

  const likedCommentIds = new Set((commentLikedRows || []).map((row) => row.comment_id));

  const hydratedComments = (comments || []).map((comment) => ({
    ...comment,
    like_count: commentLikeCounts.get(comment.id) || 0,
    initial_liked: likedCommentIds.has(comment.id),
  }));

  const author = Array.isArray(post.profiles) ? post.profiles[0] : post.profiles;
  const category = Array.isArray(post.categories) ? post.categories[0] : post.categories;
  const group = Array.isArray(post.groups) ? post.groups[0] : post.groups;
  const authorUsername = author?.username || "member";
  const authorDisplayName = author?.display_name || authorUsername;
  const isOwner = user?.id === post.user_id;

  return (
    <main className="container-shell max-w-4xl py-10">
      <div className="space-y-6">
        <article className="card">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted">
                <span>{category?.name || "General Preparedness"}</span>
                {group?.slug ? (
                  <>
                    <span>•</span>
                    <Link href={`/groups/${group.slug}`} className="hover:text-text">{group.name}</Link>
                  </>
                ) : null}
              </div>
              <h1 className="mt-3 text-3xl font-bold leading-tight">{post.title}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted">
                <Link href={`/profile/${authorUsername}`} className="font-semibold text-text hover:underline">{authorDisplayName}</Link>
                <span>@{authorUsername}</span>
                <span>•</span>
                <span>{post.created_at ? new Date(post.created_at).toLocaleString() : "Just now"}</span>
              </div>
            </div>
            {isOwner ? <PostOwnerActions postId={post.id} /> : null}
          </div>

          <p className="mt-6 whitespace-pre-wrap text-sm leading-7 text-muted">{post.content}</p>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-muted">
            <LikeButton postId={post.id} postAuthorId={post.user_id} initialLiked={Boolean(likeRow)} initialCount={likeCount || 0} />
            <span>{commentCount || 0} comments</span>
            <Link href={`/profile/${authorUsername}`} className="rounded-xl border border-border bg-panelSoft px-3 py-2 transition hover:text-text">View Profile</Link>
            {!isOwner ? <ReportPostButton postId={post.id} /> : null}
          </div>
        </article>

        <CommentSection postId={post.id} postAuthorId={post.user_id} comments={hydratedComments} />
      </div>
    </main>
  );
}
