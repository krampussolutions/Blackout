import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import MarkNotificationsReadButton from "@/components/MarkNotificationsReadButton";
import RealtimeNotificationsList from "@/components/RealtimeNotificationsList";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect_to=/notifications");

  const { data: notifications } = await supabase
    .from("notifications")
    .select("id, user_id, actor_id, type, post_id, comment_id, group_id, message_id, metadata, read_at, created_at, profiles!notifications_actor_id_fkey(username, display_name)")
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
            <p className="mt-2 text-sm text-muted">Likes, comments, follows, group joins, direct messages, and accepted invites all in one place.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-border bg-panelSoft px-3 py-1 text-xs uppercase tracking-[0.16em] text-muted">
              {unreadCount} unread
            </span>
            <Link href="/settings/notifications" className="button-secondary">Settings</Link>
            <MarkNotificationsReadButton />
          </div>
        </div>

        <RealtimeNotificationsList userId={user.id} initialNotifications={(notifications || []) as any} />

        {!(notifications || []).length ? (
          <div className="card space-y-4">
            <p className="text-sm text-muted">Once people interact with your posts, follows, groups, invites, or messages, they will show up here.</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/feed" className="button-primary">Go to feed</Link>
              <Link href="/invite" className="button-secondary">Invite people</Link>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
