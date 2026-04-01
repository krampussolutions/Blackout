import Link from "next/link";
import { redirect } from "next/navigation";
import EnablePushNotifications from "@/components/EnablePushNotifications";
import MarkNotificationsReadButton from "@/components/MarkNotificationsReadButton";
import NotificationPreferencesForm from "@/components/NotificationPreferencesForm";
import RealtimeNotificationsList from "@/components/RealtimeNotificationsList";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { NotificationPreferences, NotificationRecord } from "@/lib/notifications/types";
import { isWebPushConfigured } from "@/lib/notifications/web-push";

export const dynamic = "force-dynamic";

type ActorProfile = { id: string; username: string | null; display_name: string | null };

type NotificationListItem = NotificationRecord & {
  actor: { username: string | null; display_name: string | null } | null;
};

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

  const [preferencesResponse, notificationsResponse] = await Promise.all([
    supabase
      .from("notification_preferences")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle<NotificationPreferences>(),
    supabase
      .from("notifications")
      .select("id, user_id, actor_id, type, post_id, comment_id, group_id, message_id, metadata, read_at, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(100),
  ]);

  const preferences = preferencesResponse.data || defaultPreferences(user.id);
  const emailConfigured = Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL);
  const pushConfigured = isWebPushConfigured();

  if (!preferencesResponse.data) {
    await supabase.from("notification_preferences").upsert(preferences, { onConflict: "user_id" });
  }

  const notifications = notificationsResponse.data || [];
  const actorIds = Array.from(new Set(notifications.map((item) => item.actor_id).filter(Boolean))) as string[];

  let actorMap = new Map<string, ActorProfile>();
  if (actorIds.length) {
    const { data: actors } = await supabase
      .from("profiles")
      .select("id, username, display_name")
      .in("id", actorIds);

    actorMap = new Map((actors || []).map((actor) => [actor.id, actor as ActorProfile]));
  }

  const initialNotifications: NotificationListItem[] = notifications.map((item) => ({
    ...(item as NotificationRecord),
    actor: item.actor_id ? actorMap.get(item.actor_id) || null : null,
  }));

  return (
    <main className="container-shell max-w-5xl py-12">
      <div className="space-y-6">
        <div className="card flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-text">Notification settings</h1>
            <p className="mt-2 text-sm text-muted">
              Manage email and browser push, and view your recent alerts in one place.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/settings/profile" className="button-secondary">Profile settings</Link>
            <Link href="/feed" className="button-secondary">Back to feed</Link>
          </div>
        </div>

        <div className="card space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-text">Recent alerts</h2>
              <p className="mt-2 text-sm text-muted">
                Likes, comments, follows, and messages tied to your account show up here.
              </p>
            </div>
            <MarkNotificationsReadButton />
          </div>
          <RealtimeNotificationsList userId={user.id} initialNotifications={initialNotifications} />
        </div>

        <div className="card space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-text">Delivery status</h2>
            <p className="mt-2 text-sm text-muted">These server-side checks tell you whether email and push are configured to send from this deployment.</p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div className={`rounded-2xl border px-4 py-3 text-sm ${emailConfigured ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200" : "border-amber-500/30 bg-amber-500/10 text-amber-100"}`}>
              <div className="font-semibold">Email delivery</div>
              <div className="mt-1 text-xs">{emailConfigured ? "Resend API key and from address are configured." : "Missing RESEND_API_KEY or RESEND_FROM_EMAIL in this deployment."}</div>
            </div>
            <div className={`rounded-2xl border px-4 py-3 text-sm ${pushConfigured ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200" : "border-amber-500/30 bg-amber-500/10 text-amber-100"}`}>
              <div className="font-semibold">Browser push delivery</div>
              <div className="mt-1 text-xs">{pushConfigured ? "VAPID keys are configured on the server." : "Missing NEXT_PUBLIC_VAPID_PUBLIC_KEY or VAPID_PRIVATE_KEY in this deployment."}</div>
            </div>
          </div>
        </div>

        <div className="card space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-text">Browser push setup</h2>
            <p className="mt-2 text-sm text-muted">Enable push on this device to get alerts even when the site is not open.</p>
          </div>
          <EnablePushNotifications />
        </div>

        <NotificationPreferencesForm initialPreferences={preferences} />
      </div>
    </main>
  );
}
