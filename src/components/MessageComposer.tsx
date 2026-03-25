"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type MessageComposerProps = {
  recipientId: string;
  recipientUsername: string;
};

export default function MessageComposer({ recipientId, recipientUsername }: MessageComposerProps) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const router = useRouter();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = content.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setError("");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push(`/login?redirect_to=/messages/${recipientUsername}`);
      return;
    }

    const { error } = await supabase.from("direct_messages").insert({
      sender_id: user.id,
      recipient_id: recipientId,
      content: trimmed,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setContent("");
    setLoading(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-3">
      <div>
        <label className="mb-2 block text-sm font-medium text-text">Reply</label>
        <textarea
          className="input min-h-28 resize-y"
          placeholder={`Send a message to @${recipientUsername}`}
          value={content}
          onChange={(event) => setContent(event.target.value)}
          maxLength={2000}
          required
        />
        <div className="mt-2 flex items-center justify-between text-xs text-muted">
          <span>Keep messages respectful and on-topic.</span>
          <span>{content.length}/2000</span>
        </div>
      </div>

      {error ? <p className="text-sm text-red-300">{error}</p> : null}

      <div className="flex justify-end">
        <button type="submit" className="button-primary" disabled={loading || !content.trim()}>
          {loading ? "Sending..." : "Send message"}
        </button>
      </div>
    </form>
  );
}
