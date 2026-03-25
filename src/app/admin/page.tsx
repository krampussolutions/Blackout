import Link from "next/link";
import { redirect } from "next/navigation";
import AdminCommentActions from "@/components/AdminCommentActions";
import AdminMemberActions from "@/components/AdminMemberActions";
import AdminPostActions from "@/components/AdminPostActions";
import AdminReportActions from "@/components/AdminReportActions";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/admin");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, membership_tier")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.membership_tier !== "admin") {
    return (
      <main className="container-shell max-w-3xl py-12">
        <div className="card">
          <h1 className="text-3xl font-bold">Admin</h1>
          <p className="mt-2 text-muted">Your account does not have admin access.</p>
        </div>
      </main>
    );
  }

  const [
    { data: posts },
    { data: comments },
    { data: members },
    { data: reports },
    { count: memberCount },
    { count: postCount },
    { count: commentCount },
  ] = await Promise.all([
    supabase
      .from("posts")
      .select("id, title, content, created_at, profiles!posts_user_id_fkey(username, display_name), categories(name)")
      .order("created_at", { ascending: false })
      .limit(15),
    supabase
      .from("comments")
      .select("id, content, created_at, post_id, profiles!comments_user_id_fkey(username, display_name)")
      .order("created_at", { ascending: false })
      .limit(15),
    supabase
      .from("profiles")
      .select("id, username, display_name, location, membership_tier, created_at")
      .order("created_at", { ascending: false })
      .limit(20),
    supabase
      .from("post_reports")
      .select("id, reason, created_at, post_id, posts(title), profiles!post_reports_reporter_id_fkey(username, display_name)")
      .eq("status", "open")
      .order("created_at", { ascending: false })
      .limit(15),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("posts").select("id", { count: "exact", head: true }),
    supabase.from("comments").select("id", { count: "exact", head: true }),
  ]);

  return (
    <main className="container-shell py-12">
      <div className="space-y-6">
        <div className="card">
          <h1 className="text-3xl font-bold">Admin moderation</h1>
          <p className="mt-2 text-muted">
            Review members, recent posts, and recent comments. Use this screen for lightweight moderation and account oversight.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="card">
            <div className="text-3xl font-bold">{memberCount || 0}</div>
            <div className="mt-2 text-sm text-muted">Members</div>
          </div>
          <div className="card">
            <div className="text-3xl font-bold">{postCount || 0}</div>
            <div className="mt-2 text-sm text-muted">Posts</div>
          </div>
          <div className="card">
            <div className="text-3xl font-bold">{commentCount || 0}</div>
            <div className="mt-2 text-sm text-muted">Comments</div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.25fr_1fr]">
          <section className="space-y-4">
            <div className="card">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">Recent posts</h2>
                  <p className="mt-1 text-sm text-muted">Delete spam, duplicate posts, or content that breaks your rules.</p>
                </div>
              </div>
            </div>

            {(posts || []).map((post) => {
              const author = Array.isArray(post.profiles) ? post.profiles[0] : post.profiles;
              const category = Array.isArray(post.categories) ? post.categories[0] : post.categories;

              return (
                <div key={post.id} className="card space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="text-xs uppercase tracking-[0.18em] text-muted">
                        {category?.name || "General Preparedness"}
                      </div>
                      <h3 className="mt-2 text-xl font-semibold">{post.title}</h3>
                      <p className="mt-2 text-sm text-muted">
                        by{" "}
                        <Link href={`/profile/${author?.username || "member"}`} className="font-semibold text-text hover:underline">
                          {author?.display_name || author?.username || "Member"}
                        </Link>
                      </p>
                    </div>
                    <AdminPostActions postId={post.id} />
                  </div>
                  <p className="text-sm leading-6 text-muted">{post.content}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-muted">
                    <span>{post.created_at ? new Date(post.created_at).toLocaleString() : "Just now"}</span>
                    <Link href={`/posts/${post.id}`} className="hover:text-text">
                      Open post
                    </Link>
                  </div>
                </div>
              );
            })}
          </section>

          <aside className="space-y-6">
            <div className="card space-y-4">
              <div>
                <h2 className="text-xl font-semibold">Recent comments</h2>
                <p className="mt-1 text-sm text-muted">Clear low-quality replies or abuse quickly.</p>
              </div>

              <div className="space-y-4">
                {(comments || []).map((comment) => {
                  const author = Array.isArray(comment.profiles) ? comment.profiles[0] : comment.profiles;
                  return (
                    <div key={comment.id} className="rounded-2xl border border-border bg-panelSoft p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold">
                            {author?.display_name || author?.username || "Member"}
                          </p>
                          <p className="mt-1 text-xs text-muted">
                            @{author?.username || "member"} • {comment.created_at ? new Date(comment.created_at).toLocaleString() : "Just now"}
                          </p>
                        </div>
                        <AdminCommentActions commentId={comment.id} />
                      </div>
                      <p className="mt-3 text-sm leading-6 text-muted">{comment.content}</p>
                      <Link href={`/posts/${comment.post_id}`} className="mt-3 inline-flex text-xs font-medium text-muted hover:text-text">
                        Open parent post
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>


            <div className="card space-y-4">
              <div>
                <h2 className="text-xl font-semibold">Post reports</h2>
                <p className="mt-1 text-sm text-muted">Review flagged posts and clear handled reports.</p>
              </div>

              <div className="space-y-4">
                {(reports || []).length ? (reports || []).map((report) => {
                  const reporter = Array.isArray(report.profiles) ? report.profiles[0] : report.profiles;
                  const post = Array.isArray(report.posts) ? report.posts[0] : report.posts;
                  return (
                    <div key={report.id} className="rounded-2xl border border-border bg-panelSoft p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold">{post?.title || "Reported post"}</p>
                          <p className="mt-1 text-xs text-muted">
                            Reported by {reporter?.display_name || reporter?.username || "Member"}
                            {report.created_at ? ` • ${new Date(report.created_at).toLocaleString()}` : ""}
                          </p>
                        </div>
                        <AdminReportActions reportId={report.id} />
                      </div>
                      {report.reason ? <p className="mt-3 text-sm leading-6 text-muted">{report.reason}</p> : null}
                      <Link href={`/posts/${report.post_id}`} className="mt-3 inline-flex text-xs font-medium text-muted hover:text-text">
                        Open reported post
                      </Link>
                    </div>
                  );
                }) : <div className="rounded-2xl border border-border bg-panelSoft p-4 text-sm text-muted">No open reports.</div>}
              </div>
            </div>

            <div className="card space-y-4">
              <div>
                <h2 className="text-xl font-semibold">Member access</h2>
                <p className="mt-1 text-sm text-muted">Promote trusted moderators or review new signups.</p>
              </div>

              <div className="space-y-3">
                {(members || []).map((member) => (
                  <div key={member.id} className="rounded-2xl border border-border bg-panelSoft p-4">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <Link href={`/profile/${member.username}`} className="font-semibold text-text hover:underline">
                          {member.display_name || member.username}
                        </Link>
                        <p className="mt-1 text-xs text-muted">
                          @{member.username}
                          {member.location ? ` • ${member.location}` : ""}
                        </p>
                        <p className="mt-2 text-xs text-muted">
                          Joined {member.created_at ? new Date(member.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "recently"}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="rounded-full border border-border px-2 py-1 text-[11px] uppercase tracking-[0.18em] text-muted">
                          {member.membership_tier || "free"}
                        </span>
                        <AdminMemberActions
                          memberId={member.id}
                          username={member.username}
                          membershipTier={member.membership_tier}
                          isCurrentAdmin={member.id === user.id}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold">Session</h2>
                  <p className="mt-1 text-sm text-muted">Log out of the moderation session when you are done.</p>
                </div>
                <Link href="/settings/profile" className="button-secondary">Profile settings</Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
