import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getNotificationHref, getNotificationText } from "@/lib/notifications/content";
import type { NotificationRecord } from "@/lib/notifications/types";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ notification: null }, { status: 401 });
  }

  const { data: notification } = await supabase
    .from("notifications")
    .select("id, user_id, actor_id, type, post_id, comment_id, group_id, message_id, metadata, read_at, created_at, profiles!notifications_actor_id_fkey(username, display_name)")
    .eq("user_id", user.id)
    .is("read_at", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!notification) {
    return NextResponse.json({ notification: null });
  }

  const actor = Array.isArray(notification.profiles) ? notification.profiles[0] : notification.profiles;

  return NextResponse.json({
    notification: {
      id: notification.id,
      title: "Blackout Network",
      body: getNotificationText(notification as NotificationRecord, actor),
      href: getNotificationHref(notification as NotificationRecord, actor),
    },
  });
}
