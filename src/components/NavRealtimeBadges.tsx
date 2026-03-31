"use client";

import { useEffect, useMemo, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Props = {
  userId: string;
  initialMessageCount: number;
  initialNotificationCount: number;
};

export default function NavRealtimeBadges({ userId, initialMessageCount, initialNotificationCount }: Props) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [messageCount, setMessageCount] = useState(initialMessageCount);
  const [notificationCount, setNotificationCount] = useState(initialNotificationCount);

  useEffect(() => {
    let active = true;

    async function refreshCounts() {
      const [{ count: unreadMessages }, { count: unreadNotifications }] = await Promise.all([
        supabase.from("direct_messages").select("id", { head: true, count: "exact" }).eq("recipient_id", userId).is("read_at", null),
        supabase.from("notifications").select("id", { head: true, count: "exact" }).eq("user_id", userId).is("read_at", null),
      ]);

      if (!active) return;
      setMessageCount(unreadMessages ?? 0);
      setNotificationCount(unreadNotifications ?? 0);
    }

    const channel = supabase
      .channel(`nav-badges-${userId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${userId}` }, refreshCounts)
      .on("postgres_changes", { event: "*", schema: "public", table: "direct_messages", filter: `recipient_id=eq.${userId}` }, refreshCounts)
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [supabase, userId]);

  return (
    <>
      {messageCount > 0 ? (
        <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-semibold text-black">
          {messageCount > 99 ? "99+" : messageCount}
        </span>
      ) : null}
      {notificationCount > 0 ? (
        <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-semibold text-black">
          {notificationCount > 99 ? "99+" : notificationCount}
        </span>
      ) : null}
    </>
  );
}
