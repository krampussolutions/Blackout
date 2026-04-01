"use client";

import type { NotificationMetadata, NotificationType } from "@/lib/notifications/types";

function emitAlertsChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("alerts:changed"));
  }
}

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
  const response = await fetch("/api/alerts/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    cache: "no-store",
    body: JSON.stringify(input),
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.error || "Failed to create alert");
  }

  emitAlertsChanged();

  return payload?.notification ?? null;
}

export function emitAlertsRead() {
  emitAlertsChanged();
}
