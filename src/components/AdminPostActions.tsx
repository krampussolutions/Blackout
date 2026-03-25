"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type AdminPostActionsProps = {
  postId: string;
};

export default function AdminPostActions({ postId }: AdminPostActionsProps) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm("Delete this post? This cannot be undone.");
    if (!confirmed) return;

    setLoading(true);
    const { error } = await supabase.from("posts").delete().eq("id", postId);
    setLoading(false);

    if (!error) {
      router.refresh();
    } else {
      window.alert(error.message);
    }
  }

  return (
    <button type="button" onClick={handleDelete} disabled={loading} className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-200 transition hover:bg-red-500/20 disabled:opacity-60">
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
}
