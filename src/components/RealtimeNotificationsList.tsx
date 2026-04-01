"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getNotificationHref, getNotificationText } from "@/lib/notifications/content";
import type { NotificationRecord } from "@/lib/notifications/types";

type ActorProfile = { username: string | null; display_name: string | null } | null;
type NotificationListItem = NotificationRecord & { actor?: ActorProfile };

type Props = {
  userId: string;
  initialNotifications: NotificationListItem[];
};

function timeLabel(value: string) {
  return new Date(value).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

export default function RealtimeNotificationsList({ userId, initialNotifications }: Props) {
  const [notifications, setNotifications] = useState<NotificationListItem[]>(initialNotifications);

  useEffect(() => {
    let active = true;

    async function refreshNotifications() {
      const response = await fetch("/api/alerts/list", { credentials: "include", cache: "no-store" }).catch(() => null);
      if (!active || !response?.ok) return;
      const payload = await response.json().catch(() => null);
      if (!active) return;
      setNotifications((payload?.notifications || []) as NotificationListItem[]);
    }

    refreshNotifications();

    const onAlertsChanged = () => refreshNotifications();
    window.addEventListener("alerts:changed", onAlertsChanged);
    const timer = window.setInterval(refreshNotifications, 4000);

    return () => {
      active = false;
      window.removeEventListener("alerts:changed", onAlertsChanged);
      window.clearInterval(timer);
    };
  }, [userId]);

  if (!notifications.length) {
    return <div className="card text-sm text-muted">No alerts yet.</div>;
  }

  return (
    <div className="grid gap-4">
      {notifications.map((notification) => {
        const actor = notification.actor || null;
        return (
          <Link key={notification.id} href={getNotificationHref(notification, actor)} className={`card transition hover:border-white/20 ${!notification.read_at ? "border-brand/40" : ""}`.trim()}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-text">{getNotificationText(notification, actor)}</p>
                {notification.metadata?.excerpt ? <p className="mt-2 line-clamp-2 text-sm text-muted">{notification.metadata.excerpt}</p> : null}
                {notification.metadata?.comment_excerpt ? <p className="mt-2 line-clamp-2 text-sm text-muted">{notification.metadata.comment_excerpt}</p> : null}
              </div>
              <div className="shrink-0 text-xs text-muted">{timeLabel(notification.created_at)}</div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
