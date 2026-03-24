import AdSlot from "@/components/AdSlot";
import MemberCard from "@/components/MemberCard";
import PostCard from "@/components/PostCard";
import { categories, memberProfiles, groups, rightRailTopics, samplePosts } from "@/lib/site";

export default function FeedPage() {
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
              {memberProfiles.filter((member) => member.isFollowing).map((member) => (
                <MemberCard key={member.username} member={member} />
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">Categories</h2>
            <div className="mt-4 space-y-2 text-sm text-muted">
              {categories.map((category) => (
                <div key={category.slug} className="rounded-xl bg-panelSoft px-3 py-3">{category.name}</div>
              ))}
            </div>
          </div>
        </aside>

        <section className="min-w-0 space-y-4">
          <div className="card">
            <h1 className="text-2xl font-bold">Home Feed</h1>
            <p className="mt-2 text-sm text-muted">A social feed with member profiles, following, and post discovery.</p>
          </div>

          {samplePosts.map((post, index) => (
            <div key={post.id} className="space-y-4">
              <PostCard {...post} />
              {index === 0 ? <AdSlot /> : null}
            </div>
          ))}
        </section>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
          <div className="card">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">Suggested Members</h2>
            <div className="mt-4 space-y-3">
              {memberProfiles.filter((member) => !member.isFollowing).map((member) => (
                <MemberCard key={member.username} member={member} />
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">Groups</h2>
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
