"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function MarkNotificationsReadButton() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (loading) return;
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login?redirect_to=/notifications");
      return;
    }

    await supabase
      .from("notifications")
      .update({ read_at: new Date().toISOString() })
      .eq("user_id", user.id)
      .is("read_at", null);

    setLoading(false);
    router.refresh();
  }

  return (
    <button type="button" onClick={handleClick} disabled={loading} className="button-secondary">
      {loading ? "Saving..." : "Mark all read"}
    </button>
  );
}
