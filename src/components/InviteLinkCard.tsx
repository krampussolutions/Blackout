"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type InviteRow = {
  id: string;
  code: string;
  created_at: string;
};

function buildCode() {
  return `bn-${Math.random().toString(36).slice(2, 8)}${Math.random().toString(36).slice(2, 6)}`;
}

export default function InviteLinkCard() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const router = useRouter();
  const [invite, setInvite] = useState<InviteRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [copying, setCopying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadInvite() {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login?redirect_to=/invite");
        return;
      }

      const { data: existing, error: existingError } = await supabase
        .from("invite_links")
        .select("id, code, created_at")
        .eq("inviter_id", user.id)
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (existingError) {
        setError(existingError.message);
        setLoading(false);
        return;
      }

      if (existing) {
        setInvite(existing);
        setLoading(false);
        return;
      }

      const code = buildCode();
      const { data: created, error: createError } = await supabase
        .from("invite_links")
        .insert({ inviter_id: user.id, code })
        .select("id, code, created_at")
        .maybeSingle();

      if (createError) {
        setError(createError.message);
      } else {
        setInvite(created);
      }

      setLoading(false);
    }

    loadInvite();
  }, [router, supabase]);

  async function handleCopy() {
    if (!invite) return;
    setCopying(true);
    const url = `${window.location.origin}/signup?invite=${invite.code}`;
    await navigator.clipboard.writeText(url);
    setCopying(false);
  }

  const inviteUrl = invite && typeof window !== "undefined"
    ? `${window.location.origin}/signup?invite=${invite.code}`
    : invite
      ? `/signup?invite=${invite.code}`
      : "";

  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-text">Your invite link</h2>
      <p className="mt-2 text-sm text-muted">Send this to friends, family, or local preparedness contacts so they land on a signup page tied to your invite.</p>

      <div className="mt-4 rounded-2xl border border-border bg-panelSoft p-4">
        {loading ? (
          <p className="text-sm text-muted">Generating your invite link...</p>
        ) : error ? (
          <p className="text-sm text-red-300">{error}</p>
        ) : invite ? (
          <>
            <div className="break-all text-sm text-text">{inviteUrl}</div>
            <div className="mt-4 flex flex-wrap gap-3">
              <button type="button" onClick={handleCopy} className="button-primary">
                {copying ? "Copied" : "Copy invite link"}
              </button>
              <button type="button" onClick={() => router.push(`/signup?invite=${invite.code}`)} className="button-secondary">
                Preview signup page
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
