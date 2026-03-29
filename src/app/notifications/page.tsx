import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import MarkNotificationsReadButton from "@/components/MarkNotificationsReadButton";

type NotificationRow = {
  id: string;
  type: string;
  read_at: string | null;
  created_at: string;
  metadata: Record<string, string | null> | null;
  post_id: string | null;
  group_id: string | null;
  actor_id: string | null;
  profiles: { username: string | null; display_name: string | null } | { username: string | null; display_name: string | null }[] | null;
};

function timeLabel(value: string) {
  return new Date(value).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

function buildHref(notification: NotificationRow) {
  if (notification.post_id) return `/posts/${notification.post_id}`;
  if (notification.group_id && notification.metadata?.group_slug) return `/groups/${notification.metadata.group_slug}`;
  if (notification.type === "follow" && notification.profiles) {
    const actor = Array.isArray(notification.profiles) ? notification.profiles[0] : notification.profiles;
    if (actor?.username) return `/profile/${actor.username}`;
  }
  if (notification.type === "message" && notification.profiles) {
    const actor = Array.isArray(notification.profiles) ? notification.profiles[0] : notification.profiles;
    if (actor?.username) return `/messages/${actor.username}`;
  }
  return "/feed";
}

function buildText(notification: NotificationRow) {
  const actor = Array.isArray(notification.profiles) ? notification.profiles[0] : notification.profiles;
  const actorName = actor?.display_name || actor?.username || "Someone";
  switch (notification.type) {
    case "like":
      return `${actorName} liked your post${notification.metadata?.post_title ? `: ${notification.metadata.post_title}` : "."}`;
    case "comment":
      return `${actorName} commented on your post${notification.metadata?.post_title ? `: ${notification.metadata.post_title}` : "."}`;
    case "follow":
      return `${actorName} followed you.`;
    case "group_join":
      return `${actorName} joined your group${notification.metadata?.group_name ? `: ${notification.metadata.group_name}` : "."}`;
    case "message":
      return `${actorName} sent you a message.`;
    default:
      return notification.metadata?.text || "You have a new notification.";
  }
}

export default async function NotificationsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect_to=/notifications");

  const { data: notifications } = await supabase
    .from("notifications")
    .select("id, type, read_at, created_at, metadata, post_id, group_id, actor_id, profiles!notifications_actor_id_fkey(username, display_name)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(100);

  const unreadCount = (notifications || []).filter((item) => !item.read_at).length;

  return (
    <main className="container-shell py-10">
      <div className="space-y-6">
        <div className="card flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text">Notifications</h1>
            <p className="mt-2 text-sm text-muted">Likes, comments, follows, group joins, and messages all in one place.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-border bg-panelSoft px-3 py-1 text-xs uppercase tracking-[0.16em] text-muted">
              {unreadCount} unread
            </span>
            <MarkNotificationsReadButton />
          </div>
        </div>

        {(notifications || []).length ? (
          <div className="grid gap-4">
            {(notifications || []).map((notification) => (
              <Link key={notification.id} href={buildHref(notification as NotificationRow)} className={`card transition hover:border-white/20 ${!notification.read_at ? "border-brand/40" : ""}`.trim()}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-text">{buildText(notification as NotificationRow)}</p>
                    {notification.metadata?.comment_excerpt ? <p className="mt-2 line-clamp-2 text-sm text-muted">{notification.metadata.comment_excerpt}</p> : null}
                  </div>
                  <div className="shrink-0 text-xs text-muted">{timeLabel(notification.created_at)}</div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="card space-y-4">
            <p className="text-sm text-muted">No notifications yet. Once people interact with your posts, follows, groups, or messages, they will show up here.</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/feed" className="button-primary">Go to feed</Link>
              <Link href="/invite" className="button-secondary">Invite people</Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
