"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import MessageComposer from "@/components/MessageComposer";

type Message = {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  created_at: string;
  read_at: string | null;
};

type Props = {
  currentUserId: string;
  peerId: string;
  peerUsername: string;
  initialMessages: Message[];
};

function formatMessageTime(value: string) {
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function RealtimeMessageThread({
  currentUserId,
  peerId,
  peerUsername,
  initialMessages,
}: Props) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    let active = true;

    async function refreshMessages() {
      const { data } = await supabase
        .from("direct_messages")
        .select("id, sender_id, recipient_id, content, created_at, read_at")
        .or(
          `and(sender_id.eq.${currentUserId},recipient_id.eq.${peerId}),and(sender_id.eq.${peerId},recipient_id.eq.${currentUserId})`
        )
        .order("created_at", { ascending: true })
        .limit(200);

      if (!active) return;
      setMessages((data as Message[]) || []);

      await supabase
        .from("direct_messages")
        .update({ read_at: new Date().toISOString() })
        .eq("sender_id", peerId)
        .eq("recipient_id", currentUserId)
        .is("read_at", null);
    }

    refreshMessages();

    const channel = supabase
      .channel(`messages-thread-${currentUserId}-${peerId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "direct_messages",
          filter: `sender_id=eq.${peerId}`,
        },
        refreshMessages
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "direct_messages",
          filter: `recipient_id=eq.${peerId}`,
        },
        refreshMessages
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [currentUserId, peerId, supabase]);

  return (
    <>
      <div className="card space-y-4">
        <div className="flex items-center justify-between gap-3 border-b border-border pb-3">
          <div>
            <h2 className="text-lg font-semibold text-text">Conversation</h2>
            <p className="text-sm text-muted">
              Direct messages are private between you and @{peerUsername}.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {messages.length ? (
            messages.map((message) => {
              const isMine = message.sender_id === currentUserId;

              return (
                <div key={message.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                      isMine ? "bg-emerald-700 text-white" : "bg-panelSoft text-text"
                    }`}
                  >
                    <p>{message.content}</p>
                    <div className={`mt-2 text-[11px] ${isMine ? "text-white/80" : "text-muted"}`}>
                      {formatMessageTime(message.created_at)}
                      {isMine ? (message.read_at ? " • Read" : " • Sent") : ""}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="rounded-2xl border border-dashed border-border p-6 text-sm text-muted">
              No messages yet. Start the conversation below.
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      <MessageComposer recipientId={peerId} recipientUsername={peerUsername} />
    </>
  );
}
