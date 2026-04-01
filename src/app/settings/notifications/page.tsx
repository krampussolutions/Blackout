import Link from "next/link";
import { redirect } from "next/navigation";
import EnablePushNotifications from "@/components/EnablePushNotifications";
import NotificationPreferencesForm from "@/components/NotificationPreferencesForm";
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

  const { data: preferencesRow } = await supabase
    .from("notification_preferences")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle<NotificationPreferences>();

  const preferences = preferencesRow || defaultPreferences(user.id);

  if (!preferencesRow) {
    await supabase.from("notification_preferences").upsert(preferences, { onConflict: "user_id" });
  }

  return (
    <main className="container-shell max-w-5xl py-12">
      <div className="space-y-6">
        <div className="card flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-text">Notification settings</h1>
            <p className="mt-2 text-sm text-muted">Control email delivery, browser push, and real-time alerts for activity across Blackout Network.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/notifications" className="button-secondary">Back to notifications</Link>
            <Link href="/settings/profile" className="button-secondary">Profile settings</Link>
          </div>
        </div>

        <div className="card space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-text">Browser push setup</h2>
            <p className="mt-2 text-sm text-muted">Enable push on this device to get alerts even when the site is not open. This uses a service worker plus browser push subscriptions.</p>
          </div>
          <EnablePushNotifications />
        </div>

        <NotificationPreferencesForm initialPreferences={preferences} />
      </div>
    </main>
  );
}
