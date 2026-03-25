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
      .select("id, title, content, created_at, user_id, categories(name), profiles!posts_user_id_fkey(username, display_name)")
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("comments")
      .select("id, content, created_at, profiles!comments_user_id_fkey(username, display_name)")
      .eq("post_id", id)
      .order("created_at", { ascending: true }),
    supabase.from("likes").select("id", { count: "exact", head: true }).eq("post_id", id),
    supabase.from("comments").select("id", { count: "exact", head: true }).eq("post_id", id),
    user ? supabase.from("likes").select("id").eq("post_id", id).eq("user_id", user.id).maybeSingle() : Promise.resolve({ data: null }),
  ]);

  if (!post) notFound();

  const author = Array.isArray(post.profiles) ? post.profiles[0] : post.profiles;
  const category = Array.isArray(post.categories) ? post.categories[0] : post.categories;
  const authorUsername = author?.username || "member";
  const authorDisplayName = author?.display_name || authorUsername;
  const isOwner = user?.id === post.user_id;

  return (
    <main className="container-shell max-w-4xl py-10">
      <div className="space-y-6">
        <article className="card">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.18em] text-muted">{category?.name || "General Preparedness"}</div>
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
            <LikeButton postId={post.id} initialLiked={Boolean(likeRow)} initialCount={likeCount || 0} />
            <span>{commentCount || 0} comments</span>
            <Link href={`/profile/${authorUsername}`} className="rounded-xl border border-border bg-panelSoft px-3 py-2 transition hover:text-text">View Profile</Link>
            {!isOwner ? <ReportPostButton postId={post.id} /> : null}
          </div>
        </article>

        <CommentSection postId={post.id} comments={comments || []} />
      </div>
    </main>
  );
}
