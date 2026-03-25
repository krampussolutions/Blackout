import Link from "next/link";
import { getMemberProfile } from "@/lib/site";
import LikeButton from "@/components/LikeButton";
import PostOwnerActions from "@/components/PostOwnerActions";

type PostCardProps = {
  id: string;
  title: string;
  category: string;
  author: string;
  authorDisplayName?: string;
  excerpt: string;
  comments: number;
  likes?: number;
  initialLiked?: boolean;
  isOwner?: boolean;
};

export default function PostCard({
  id,
  title,
  category,
  author,
  authorDisplayName,
  excerpt,
  comments,
  likes = 0,
  initialLiked = false,
  isOwner = false,
}: PostCardProps) {
  const profile = getMemberProfile(author);
  const avatar = profile?.avatar || author.slice(0, 2).toUpperCase();
  const displayName = authorDisplayName || profile?.displayName || author;

  return (
    <article className="card">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-panelSoft text-sm font-semibold text-text">
          {avatar}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <Link href={`/profile/${author}`} className="font-semibold text-text hover:underline">{displayName}</Link>
            <span className="text-xs text-muted">@{author}</span>
            <span className="text-xs text-muted">posted in {category}</span>
          </div>
          <p className="mt-1 text-xs text-muted">Preparedness discussion</p>
        </div>
        {isOwner ? <PostOwnerActions postId={id} canEdit compact /> : null}
      </div>

      <Link href={`/posts/${id}`} className="block hover:opacity-95">
        <h3 className="mb-2 text-xl font-semibold leading-tight">{title}</h3>
        <p className="mb-5 whitespace-pre-wrap text-sm leading-6 text-muted">{excerpt}</p>
      </Link>

      <div className="mb-4 flex items-center gap-4 text-xs text-muted">
        <span>{likes} likes</span>
        <span>{comments} comments</span>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
        <LikeButton postId={id} initialLiked={initialLiked} initialCount={likes} />
        <Link href={`/posts/${id}`} className="rounded-xl border border-border bg-panelSoft px-3 py-2 transition hover:text-text">Comment</Link>
        <Link href={`/posts/${id}`} className="rounded-xl border border-border bg-panelSoft px-3 py-2 transition hover:text-text">View Post</Link>
        <Link href={`/profile/${author}`} className="ml-auto rounded-xl border border-border bg-panelSoft px-3 py-2 transition hover:text-text">
          View Profile
        </Link>
      </div>
    </article>
  );
}
