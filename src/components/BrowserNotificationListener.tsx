"use client";

import { useEffect, useMemo, useRef } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type LatestUnreadResponse = {
  notification: {
    id: string;
    title: string;
    body: string;
    href: string;
  } | null;
};

export default function BrowserNotificationListener() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const lastShownId = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let currentUserId: string | null = null;

    async function showLatestNotification() {
      if (typeof window === "undefined") return;
      if (!("Notification" in window) || Notification.permission !== "granted") return;

      const response = await fetch("/api/notifications/latest-unread", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      }).catch(() => null);

      if (!response?.ok) return;

      const data = (await response.json().catch(() => null)) as LatestUnreadResponse | null;
      const notification = data?.notification;
      if (!notification || lastShownId.current === notification.id) return;
      lastShownId.current = notification.id;

      try {
        if ("serviceWorker" in navigator) {
          const registration = await navigator.serviceWorker.ready;
          await registration.showNotification(notification.title, {
            body: notification.body,
            data: { href: notification.href },
            badge: "/og-image.png",
            icon: "/og-image.png",
            tag: `blackout-${notification.id}`,
          });
          return;
        }
      } catch {
        // Fall back to the page Notification API below.
      }

      const browserNotification = new Notification(notification.title, {
        body: notification.body,
      });
      browserNotification.onclick = () => {
        window.focus();
        window.location.href = notification.href;
      };
    }

    async function setup() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || cancelled) return;
      currentUserId = user.id;

      const channel = supabase
        .channel(`browser-alerts-${user.id}`)
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` },
          showLatestNotification,
        )
        .subscribe();

      const timer = window.setInterval(showLatestNotification, 5000);

      if (cancelled) {
        window.clearInterval(timer);
        supabase.removeChannel(channel);
        return;
      }

      return () => {
        window.clearInterval(timer);
        supabase.removeChannel(channel);
      };
    }

    let cleanup: (() => void) | undefined;
    setup().then((fn) => {
      cleanup = fn;
    });

    return () => {
      cancelled = true;
      cleanup?.();
      if (currentUserId) {
        supabase.removeChannel(supabase.channel(`browser-alerts-${currentUserId}`));
      }
    };
  }, [supabase]);

  return null;
}
