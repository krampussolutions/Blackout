import { redirect } from "next/navigation";
import EnablePushNotifications from "@/components/EnablePushNotifications";
import MarkNotificationsReadButton from "@/components/MarkNotificationsReadButton";
import NotificationPreferencesForm from "@/components/NotificationPreferencesForm";
import RealtimeNotificationsList from "@/components/RealtimeNotificationsList";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { NotificationPreferences } from "@/lib/notifications/types";

function defaultPreferences(userId: string): NotificationPreferences {
  return {
    user_id: userId,
    email_enabled: true,
    email_like: true,
    email_comment: true,
    email_follow: true,
    email_group_join: true,
    email_message: true,
    email_invite_accepted: true,
    email_system: true,
    push_enabled: false,
    push_like: true,
    push_comment: true,
    push_follow: true,
    push_group_join: true,
    push_message: true,
    push_invite_accepted: true,
    push_system: true,
  };
}

export default async function NotificationSettingsPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect_to=/settings/notifications");
  }

  const [{ data: preferencesRow }, { data: notifications }] = await Promise.all([
    supabase.from("notification_preferences").select("*").eq("user_id", user.id).maybeSingle<NotificationPreferences>(),
    supabase
      .from("notifications")
      .select("id, user_id, actor_id, type, post_id, comment_id, group_id, message_id, metadata, read_at, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(100),
  ]);

  const preferences = preferencesRow || defaultPreferences(user.id);

  if (!preferencesRow) {
    await supabase.from("notification_preferences").upsert(preferences);
  }

  const unreadCount = (notifications || []).filter((item) => !item.read_at).length;

  return (
    <main className="container-shell max-w-5xl py-12">
      <div className="space-y-6">
        <div className="card flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-text">Alerts</h1>
            <p className="mt-2 text-sm text-muted">Likes, comments, follows, and messages tied to your account show up here.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-border bg-panelSoft px-3 py-1 text-xs uppercase tracking-[0.16em] text-muted">
              {unreadCount} unread
            </span>
            <MarkNotificationsReadButton />
          </div>
        </div>

        <RealtimeNotificationsList userId={user.id} initialNotifications={(notifications || []) as any} />

        <div className="card space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-text">Browser push setup</h2>
            <p className="mt-2 text-sm text-muted">Enable browser alerts on this device. You can turn them off anytime below.</p>
          </div>
          <EnablePushNotifications />
        </div>

        <NotificationPreferencesForm initialPreferences={preferences} />
      </div>
    </main>
  );
}
