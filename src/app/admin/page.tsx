import { redirect } from "next/navigation";
import AdminPostActions from "@/components/AdminPostActions";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/admin");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("membership_tier")
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

  const [{ data: posts }, { count: memberCount }, { count: postCount }] = await Promise.all([
    supabase
      .from("posts")
      .select("id, title, content, created_at, profiles!posts_user_id_fkey(username, display_name), categories(name)")
      .order("created_at", { ascending: false })
      .limit(25),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("posts").select("id", { count: "exact", head: true }),
  ]);

  return (
    <main className="container-shell py-12">
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="card"><div className="text-3xl font-bold">{memberCount || 0}</div><div className="mt-2 text-sm text-muted">Members</div></div>
          <div className="card"><div className="text-3xl font-bold">{postCount || 0}</div><div className="mt-2 text-sm text-muted">Posts</div></div>
          <div className="card"><div className="text-3xl font-bold">25</div><div className="mt-2 text-sm text-muted">Recent posts loaded</div></div>
        </div>

        <div className="card">
          <h1 className="text-3xl font-bold">Moderation</h1>
          <p className="mt-2 text-muted">Review the latest posts and remove anything that violates community rules.</p>
        </div>

        <div className="space-y-4">
          {(posts || []).map((post) => {
            const author = Array.isArray(post.profiles) ? post.profiles[0] : post.profiles;
            const category = Array.isArray(post.categories) ? post.categories[0] : post.categories;
            return (
              <div key={post.id} className="card">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-[0.18em] text-muted">{category?.name || "General"}</div>
                    <h2 className="mt-2 text-xl font-semibold">{post.title}</h2>
                    <p className="mt-2 text-sm text-muted">By {author?.display_name || author?.username || "member"}</p>
                  </div>
                  <AdminPostActions postId={post.id} />
                </div>
                <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-muted">{post.content}</p>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
