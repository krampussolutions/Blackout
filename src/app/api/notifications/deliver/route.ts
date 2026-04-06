import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getNotificationHref, getNotificationText, isChannelEnabled } from "@/lib/notifications/content";
import { isWebPushConfigured, sendWebPush } from "@/lib/notifications/web-push";
import type { NotificationPreferences, NotificationRecord } from "@/lib/notifications/types";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

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

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null) as { notificationId?: string } | null;
  const notificationId = body?.notificationId;

  if (!notificationId) {
    return NextResponse.json({ error: "Missing notificationId" }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  const { data: notification } = await admin
    .from("notifications")
    .select("id, user_id, actor_id, type, post_id, comment_id, group_id, message_id, metadata, read_at, created_at")
    .eq("id", notificationId)
    .maybeSingle<NotificationRecord>();

  if (!notification) {
    return NextResponse.json({ error: "Notification not found" }, { status: 404 });
  }

  if (notification.actor_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [
    { data: actorProfile },
    { data: recipientProfile },
    { data: preferencesRow },
    authUserResponse,
    { data: subscriptions },
  ] = await Promise.all([
    admin.from("profiles").select("username, display_name").eq("id", user.id).maybeSingle(),
    admin.from("profiles").select("username, display_name").eq("id", notification.user_id).maybeSingle(),
    admin.from("notification_preferences").select("*").eq("user_id", notification.user_id).maybeSingle<NotificationPreferences>(),
    admin.auth.admin.getUserById(notification.user_id),
    admin.from("push_subscriptions").select("id, endpoint").eq("user_id", notification.user_id),
  ]);

  const preferences = preferencesRow || defaultPreferences(notification.user_id);
  if (!preferencesRow) {
    await admin.from("notification_preferences").upsert(preferences);
  }

  const actor = actorProfile || null;
  const text = getNotificationText(notification, actor);
  const href = getNotificationHref(notification, actor);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace("https://blackout-network.com", "https://www.blackout-network.com") || "http://localhost:3000";
  const email = authUserResponse.data.user?.email;

  let emailDelivered = false;
  let pushDelivered = false;

  if (email && resend && isChannelEnabled(preferences, "email", notification.type)) {
    const from = process.env.RESEND_FROM_EMAIL || "Blackout Network <notifications@blackout-network.com>";
    const recipientName = recipientProfile?.display_name || recipientProfile?.username || "there";
    const actorName = actor?.display_name || actor?.username || "Someone";
    const link = `${siteUrl}${href}`;
    const subject = `${actorName} • Blackout Network`;
    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#111827;">
        <h2 style="margin:0 0 16px;">Blackout Network</h2>
        <p style="font-size:16px;line-height:1.6;">Hi ${recipientName},</p>
        <p style="font-size:16px;line-height:1.6;">${text}</p>
        <p style="margin:24px 0;">
          <a href="${link}" style="display:inline-block;background:#d4ff3f;color:#111827;padding:12px 18px;border-radius:10px;text-decoration:none;font-weight:700;">Open notification</a>
        </p>
        <p style="font-size:13px;line-height:1.6;color:#6b7280;">You can change email and push settings from your notification preferences in Blackout Network.</p>
      </div>
    `;

    const { error } = await resend.emails.send({
      from,
      to: [email],
      subject,
      html,
      text: `${text}\n\nOpen: ${link}`,
    });

    emailDelivered = !error;
    if (error) {
      console.error("Resend delivery failed", error);
    }
  }

  if (subscriptions?.length && isWebPushConfigured() && isChannelEnabled(preferences, "push", notification.type)) {
    const failedEndpoints: string[] = [];

    await Promise.all(
      subscriptions.map(async (subscription) => {
        try {
          const response = await sendWebPush({ endpoint: subscription.endpoint });
          if (!response.ok && (response.status === 404 || response.status === 410)) {
            failedEndpoints.push(subscription.endpoint);
            return;
          }
          if (response.ok || response.status === 201) {
            pushDelivered = true;
          }
        } catch (pushError) {
          console.error("Web push delivery failed", pushError);
          failedEndpoints.push(subscription.endpoint);
        }
      })
    );

    if (failedEndpoints.length) {
      await admin.from("push_subscriptions").delete().in("endpoint", failedEndpoints);
    }
  }

  return NextResponse.json({ ok: true, emailDelivered, pushDelivered });
}
