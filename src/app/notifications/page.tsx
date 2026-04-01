import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect_to=/notifications");
  }

  const { data: notifications } = await supabase
    .from("notifications")
    .select("id, actor_id, type, post_id, created_at, read_at, metadata")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(100);

  const actorIds = Array.from(new Set((notifications || []).map((item) => item.actor_id).filter(Boolean)));

  const { data: actors } = actorIds.length
    ? await supabase
        .from("profiles")
        .select("id, username, display_name")
        .in("id", actorIds)
    : { data: [] as { id: string; username: string | null; display_name: string | null }[] };

  const actorMap = new Map((actors || []).map((actor) => [actor.id, actor]));

  await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("user_id", user.id)
    .is("read_at", null);

  function getHref(notification: { type: string; post_id?: string | null; actor_id?: string | null }) {
    if ((notification.type === "like" || notification.type === "comment") && notification.post_id) {
      return `/posts/${notification.post_id}`;
    }

    const actor = notification.actor_id ? actorMap.get(notification.actor_id) : null;
    if (notification.type === "follow" && actor?.username) {
      return `/profile/${actor.username}`;
    }

    if (notification.type === "message" && actor?.username) {
      return `/messages/${actor.username}`;
    }

    return "/feed";
  }

  function getLabel(notification: { type: string; actor_id?: string | null; metadata?: { excerpt?: string | null } | null }) {
    const actor = notification.actor_id ? actorMap.get(notification.actor_id) : null;
    const actorName = actor?.display_name || actor?.username || "Someone";

    switch (notification.type) {
      case "like":
        return `${actorName} liked your post.`;
      case "comment":
        return notification.metadata?.excerpt
          ? `${actorName} commented: \"${notification.metadata.excerpt}\"`
          : `${actorName} commented on your post.`;
      case "follow":
        return `${actorName} followed you.`;
      case "message":
        return `${actorName} sent you a message.`;
      default:
        return `${actorName} sent you a notification.`;
    }
  }

  return (
    <main className="container-shell max-w-4xl py-10">
      <div className="card">
        <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <h1 className="text-2xl font-bold text-text">Notifications</h1>
            <p className="mt-1 text-sm text-muted">Recent activity related to your account.</p>
          </div>
          <Link href="/feed" className="button-secondary">Back to feed</Link>
        </div>

        <div className="mt-6 space-y-3">
          {notifications?.length ? notifications.map((notification) => (
            <Link
              key={notification.id}
              href={getHref(notification)}
              className="block rounded-2xl border border-border bg-panelSoft p-4 transition hover:border-white/20"
            >
              <p className="text-sm text-text">{getLabel(notification as never)}</p>
              <p className="mt-2 text-xs text-muted">
                {notification.created_at ? new Date(notification.created_at).toLocaleString() : "Just now"}
              </p>
            </Link>
          )) : (
            <div className="rounded-2xl border border-dashed border-border p-6 text-sm text-muted">
              No notifications yet.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
