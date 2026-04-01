"use client";

import { useEffect, useMemo, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Props = {
  userId: string;
  kind: "messages" | "notifications";
  initialCount: number;
};

export default function NavRealtimeBadges({ userId, kind, initialCount }: Props) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    let active = true;

    async function refreshCount() {
      const query =
        kind === "messages"
          ? supabase.from("direct_messages").select("id", { head: true, count: "exact" }).eq("recipient_id", userId).is("read_at", null)
          : supabase.from("notifications").select("id", { head: true, count: "exact" }).eq("user_id", userId).is("read_at", null);

      const { count: nextCount } = await query;
      if (!active) return;
      setCount(nextCount ?? 0);
    }

    refreshCount();

    const channel = supabase
      .channel(`nav-badge-${kind}-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: kind === "messages" ? "direct_messages" : "notifications",
          filter: kind === "messages" ? `recipient_id=eq.${userId}` : `user_id=eq.${userId}`,
        },
        refreshCount,
      )
      .subscribe();

    const timer = window.setInterval(refreshCount, kind === "messages" ? 3000 : 5000);

    return () => {
      active = false;
      window.clearInterval(timer);
      supabase.removeChannel(channel);
    };
  }, [kind, supabase, userId]);

  if (count <= 0) return null;

  return (
    <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-semibold text-black">
      {count > 99 ? "99+" : count}
    </span>
  );
}
