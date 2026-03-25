"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type PostOwnerActionsProps = {
  postId: string;
  canEdit?: boolean;
  compact?: boolean;
};

export default function PostOwnerActions({ postId, canEdit = true, compact = false }: PostOwnerActionsProps) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm("Delete this post? This cannot be undone.");
    if (!confirmed) return;

    setLoading(true);
    const { error } = await supabase.from("posts").delete().eq("id", postId);
    setLoading(false);

    if (error) {
      window.alert(error.message);
      return;
    }

    router.push("/feed");
    router.refresh();
  }

  return (
    <div className={`flex flex-wrap items-center gap-2 ${compact ? "" : "ml-auto"}`.trim()}>
      {canEdit ? (
        <Link href={`/posts/${postId}/edit`} className="rounded-xl border border-border bg-panelSoft px-3 py-2 transition hover:text-text">
          Edit
        </Link>
      ) : null}
      <button
        type="button"
        onClick={handleDelete}
        disabled={loading}
        className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-red-200 transition hover:bg-red-500/20 disabled:opacity-60"
      >
        {loading ? "Deleting..." : "Delete"}
      </button>
    </div>
  );
}
