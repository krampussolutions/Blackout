"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { getNotificationHref, getNotificationText } from "@/lib/notifications/content";
import type { NotificationRecord } from "@/lib/notifications/types";

type NotificationListItem = NotificationRecord & {
  profiles: { username: string | null; display_name: string | null } | { username: string | null; display_name: string | null }[] | null;
};

type Props = {
  userId: string;
  initialNotifications: NotificationListItem[];
};

function timeLabel(value: string) {
  return new Date(value).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

export default function RealtimeNotificationsList({ userId, initialNotifications }: Props) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [notifications, setNotifications] = useState<NotificationListItem[]>(initialNotifications);

  useEffect(() => {
    let active = true;

    async function refreshNotifications() {
      const { data } = await supabase
        .from("notifications")
        .select("id, user_id, actor_id, type, post_id, comment_id, group_id, message_id, metadata, read_at, created_at, profiles!notifications_actor_id_fkey(username, display_name)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(100);

      if (!active) return;
      setNotifications((data as NotificationListItem[]) || []);
    }

    refreshNotifications();

    const channel = supabase
      .channel(`notifications-list-${userId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${userId}` }, refreshNotifications)
      .subscribe();

    const timer = window.setInterval(refreshNotifications, 5000);

    return () => {
      active = false;
      window.clearInterval(timer);
      supabase.removeChannel(channel);
    };
  }, [supabase, userId]);

  if (!notifications.length) {
    return <div className="card text-sm text-muted">No alerts yet.</div>;
  }

  return (
    <div className="grid gap-4">
      {notifications.map((notification) => {
        const actor = Array.isArray(notification.profiles) ? notification.profiles[0] : notification.profiles;
        return (
          <Link key={notification.id} href={getNotificationHref(notification, actor)} className={`card transition hover:border-white/20 ${!notification.read_at ? "border-brand/40" : ""}`.trim()}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-text">{getNotificationText(notification, actor)}</p>
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
