"use client";

import { useEffect, useState } from "react";

type Props = {
  userId: string;
  kind: "messages" | "notifications";
  initialCount: number;
};

export default function NavRealtimeBadges({ userId, kind, initialCount }: Props) {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    let active = true;

    async function refreshCount() {
      const endpoint = kind === "messages" ? "/api/messages/unread-count" : "/api/alerts/count";
      const response = await fetch(endpoint, { credentials: "include", cache: "no-store" }).catch(() => null);
      if (!active || !response?.ok) return;
      const payload = await response.json().catch(() => null);
      if (!active) return;
      setCount(Number(payload?.count || 0));
    }

    refreshCount();

    const onAlertsChanged = () => {
      if (kind === "notifications") refreshCount();
    };

    window.addEventListener("alerts:changed", onAlertsChanged);
    const timer = window.setInterval(refreshCount, kind === "messages" ? 3000 : 4000);

    return () => {
      active = false;
      window.removeEventListener("alerts:changed", onAlertsChanged);
      window.clearInterval(timer);
    };
  }, [kind, userId]);

  if (count <= 0) return null;

  return (
    <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-semibold text-black">
      {count > 99 ? "99+" : count}
    </span>
  );
}
