"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { NotificationMetadata, NotificationType } from "@/lib/notifications/types";

export async function createNotificationAndDeliver(input: {
  userId: string;
  actorId: string;
  type: NotificationType;
  postId?: string | null;
  commentId?: string | null;
  groupId?: string | null;
  messageId?: string | null;
  metadata?: NotificationMetadata;
}) {
  const supabase = createSupabaseBrowserClient();

  const { data: notification, error } = await supabase
    .from("notifications")
    .insert({
      user_id: input.userId,
      actor_id: input.actorId,
      type: input.type,
      post_id: input.postId ?? null,
      comment_id: input.commentId ?? null,
      group_id: input.groupId ?? null,
      message_id: input.messageId ?? null,
      metadata: input.metadata ?? {},
    })
    .select("id")
    .single();

  if (error) throw error;

  try {
    const response = await fetch("/api/notifications/deliver", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      cache: "no-store",
      keepalive: true,
      body: JSON.stringify({ notificationId: notification.id }),
    });

    if (!response.ok) {
      const payload = await response.text().catch(() => "");
      console.error("Notification delivery failed", response.status, payload);
    }
  } catch (deliveryError) {
    console.error("Notification delivery request failed", deliveryError);
  }

  return notification;
}
