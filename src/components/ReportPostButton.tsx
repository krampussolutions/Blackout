"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ReportPostButtonProps = {
  postId: string;
  compact?: boolean;
};

export default function ReportPostButton({ postId, compact = false }: ReportPostButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleReport() {
    const reason = window.prompt("Optional: why are you reporting this post?") || "";
    setLoading(true);

    const response = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, reason }),
    });

    const result = await response.json().catch(() => ({}));
    setLoading(false);

    if (!response.ok) {
      if (response.status === 401) {
        router.push(`/login?redirect_to=/posts/${postId}`);
        return;
      }
      window.alert(result.error || "Could not submit report.");
      return;
    }

    window.alert(result.duplicate ? "You already reported this post. A moderator can review it." : "Report submitted. A moderator can review it.");
  }

  return (
    <button
      type="button"
      onClick={handleReport}
      disabled={loading}
      className={compact
        ? "rounded-xl border border-border bg-panelSoft px-3 py-2 text-sm transition hover:text-text disabled:opacity-60"
        : "rounded-xl border border-border bg-panelSoft px-3 py-2 transition hover:text-text disabled:opacity-60"}
    >
      {loading ? "Reporting..." : "Report"}
    </button>
  );
}
