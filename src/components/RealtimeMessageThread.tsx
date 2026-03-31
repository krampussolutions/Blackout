"use client";

import { useEffect, useMemo, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type MessageItem = {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  created_at: string;
  read_at?: string | null;
};

type Props = {
  currentUserId: string;
  peerId: string;
  initialMessages: MessageItem[];
};

function formatMessageTime(value: string) {
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function RealtimeMessageThread({ currentUserId, peerId, initialMessages }: Props) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [messages, setMessages] = useState<MessageItem[]>(initialMessages || []);

  useEffect(() => {
    let active = true;

    async function refreshMessages() {
      const { data } = await supabase
        .from("direct_messages")
        .select("id, sender_id, recipient_id, content, created_at, read_at")
        .or(`and(sender_id.eq.${currentUserId},recipient_id.eq.${peerId}),and(sender_id.eq.${peerId},recipient_id.eq.${currentUserId})`)
        .order("created_at", { ascending: true })
        .limit(200);

      if (active) {
        setMessages((data as MessageItem[]) || []);
      }
    }

    refreshMessages();

    const channel = supabase
      .channel(`dm-thread-${currentUserId}-${peerId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "direct_messages" }, refreshMessages)
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [supabase, currentUserId, peerId]);

  if (!messages.length) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-6 text-sm text-muted">
        No messages yet. Start the conversation below.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {messages.map((message) => {
        const isMine = message.sender_id === currentUserId;

        return (
          <div key={message.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${isMine ? "bg-emerald-700 text-white" : "bg-panelSoft text-text"}`}>
              <p>{message.content}</p>
              <div className={`mt-2 text-[11px] ${isMine ? "text-white/80" : "text-muted"}`}>
                {formatMessageTime(message.created_at)}
                {isMine ? message.read_at ? " • Read" : " • Sent" : ""}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
