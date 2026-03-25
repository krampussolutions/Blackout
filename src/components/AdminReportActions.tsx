"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type AdminReportActionsProps = {
  reportId: string;
};

export default function AdminReportActions({ reportId }: AdminReportActionsProps) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function dismissReport() {
    if (loading) return;
    setLoading(true);
    const { error } = await supabase.from("post_reports").delete().eq("id", reportId);
    setLoading(false);
    if (error) {
      window.alert(error.message);
      return;
    }
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={dismissReport}
      disabled={loading}
      className="rounded-xl border border-border bg-panelSoft px-3 py-2 text-xs font-semibold text-text disabled:opacity-60"
    >
      {loading ? "Saving..." : "Dismiss"}
    </button>
  );
}
