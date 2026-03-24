import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import MemberCard from "@/components/MemberCard";
import PostCard from "@/components/PostCard";
import { categories, groups, memberProfiles, rightRailTopics, samplePosts } from "@/lib/site";

export default function HomePage() {
  return (
    <main className="container-shell py-8 md:py-10">
      <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)_300px]">
        <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
          <div className="card">
            <h1 className="text-2xl font-bold">Blackout Network</h1>
            <p className="mt-3 text-sm leading-6 text-muted">
              Connect with people focused on preparedness, outages, off-grid living, and resilient communities.
            </p>
            <div className="mt-5 grid gap-2">
              <Link href="/feed" className="button-primary">Enter Feed</Link>
              <Link href="/members" className="button-secondary">Browse Members</Link>
            </div>
          </div>

          <div className="card">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">Categories</h2>
            <div className="mt-4 space-y-3">
              {categories.map((category) => (
                <div key={category.slug} className="rounded-xl bg-panelSoft px-3 py-3">
                  <div className="font-medium text-text">{category.name}</div>
                  <p className="mt-1 text-xs leading-5 text-muted">{category.description}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <section className="min-w-0 space-y-4">
          <div className="card">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-panelSoft font-semibold">BN</div>
              <div className="flex-1 rounded-2xl border border-border bg-panelSoft px-4 py-3 text-sm text-muted">
                Share a blackout plan, gear question, or field update...
              </div>
              <Link href="/posts/new" className="button-primary shrink-0">Post</Link>
            </div>
          </div>

          {samplePosts.map((post, index) => (
            <div key={post.id} className="space-y-4">
              <PostCard {...post} />
              {index === 1 ? <AdSlot /> : null}
            </div>
          ))}
        </section>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
          <div className="card">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">Suggested Members</h2>
            <div className="mt-4 space-y-3">
              {memberProfiles.slice(1).map((member) => (
                <MemberCard key={member.username} member={member} />
              ))}
            </div>
          </div>

          <AdSlot />

          <div className="card">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">Suggested Groups</h2>
            <div className="mt-4 space-y-3">
              {groups.map((group) => (
                <div key={group.name} className="rounded-xl border border-border bg-panelSoft px-4 py-4">
                  <div className="font-medium text-text">{group.name}</div>
                  <p className="mt-1 text-xs leading-5 text-muted">{group.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">Trending</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {rightRailTopics.map((topic) => (
                <span key={topic} className="rounded-full border border-border bg-panelSoft px-3 py-2 text-xs text-muted">
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
