"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { emitAlertsRead } from "@/lib/notifications/client";

export default function MarkNotificationsReadButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (loading) return;
    setLoading(true);

    const response = await fetch("/api/alerts/read-all", {
      method: "POST",
      credentials: "include",
      cache: "no-store",
    }).catch(() => null);

    setLoading(false);

    if (!response) return;
    if (response.status === 401) {
      router.push("/login?redirect_to=/settings/notifications");
      return;
    }
    if (!response.ok) return;

    emitAlertsRead();
    router.refresh();
  }

  return (
    <button type="button" onClick={handleClick} disabled={loading} className="button-secondary">
      {loading ? "Saving..." : "Mark all read"}
    </button>
  );
}
