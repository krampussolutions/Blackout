import Link from "next/link";
import { getMemberProfile } from "@/lib/site";

type PostCardProps = {
  title: string;
  category: string;
  author: string;
  excerpt: string;
  comments: number;
  likes?: number;
};

export default function PostCard({ title, category, author, excerpt, comments, likes = 0 }: PostCardProps) {
  const profile = getMemberProfile(author);
  const avatar = profile?.avatar || author.slice(0, 2).toUpperCase();
  const displayName = profile?.displayName || author;

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
          <p className="mt-1 text-xs text-muted">Just now • Preparedness discussion</p>
        </div>
      </div>

      <h3 className="mb-2 text-xl font-semibold leading-tight">{title}</h3>
      <p className="mb-5 text-sm leading-6 text-muted">{excerpt}</p>

      <div className="mb-4 flex items-center gap-4 text-xs text-muted">
        <span>{likes} likes</span>
        <span>{comments} comments</span>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
        <button className="rounded-xl border border-border bg-panelSoft px-3 py-2 transition hover:text-text">Like</button>
        <button className="rounded-xl border border-border bg-panelSoft px-3 py-2 transition hover:text-text">Comment</button>
        <button className="rounded-xl border border-border bg-panelSoft px-3 py-2 transition hover:text-text">Save</button>
        <Link href={`/profile/${author}`} className="ml-auto rounded-xl border border-border bg-panelSoft px-3 py-2 transition hover:text-text">
          View Profile
        </Link>
      </div>
    </article>
  );
}
