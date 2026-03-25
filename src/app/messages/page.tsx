import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function formatTimestamp(value: string | null) {
  if (!value) return "";
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

type InboxThread = {
  peerId: string;
  peerUsername: string;
  peerDisplayName: string;
  avatarUrl: string | null;
  lastMessage: string;
  lastMessageAt: string | null;
  unreadCount: number;
  lastMessageFromMe: boolean;
};

export default async function MessagesPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect_to=/messages");
  }

  const [{ data: messages }, { data: profiles }] = await Promise.all([
    supabase
      .from("direct_messages")
      .select("id, sender_id, recipient_id, content, read_at, created_at")
      .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
      .order("created_at", { ascending: false })
      .limit(200),
    supabase
      .from("profiles")
      .select("id, username, display_name, avatar_url")
      .neq("id", user.id),
  ]);

  const profileMap = new Map((profiles || []).map((profile) => [profile.id, profile]));
  const threadMap = new Map<string, InboxThread>();

  for (const message of messages || []) {
    const peerId = message.sender_id === user.id ? message.recipient_id : message.sender_id;
    const peer = profileMap.get(peerId);
    if (!peer) continue;

    const existing = threadMap.get(peerId);
    if (!existing) {
      threadMap.set(peerId, {
        peerId,
        peerUsername: peer.username,
        peerDisplayName: peer.display_name || peer.username,
        avatarUrl: peer.avatar_url,
        lastMessage: message.content,
        lastMessageAt: message.created_at,
        unreadCount: message.recipient_id === user.id && !message.read_at ? 1 : 0,
        lastMessageFromMe: message.sender_id === user.id,
      });
    } else if (message.recipient_id === user.id && !message.read_at) {
      existing.unreadCount += 1;
    }
  }

  const threads = Array.from(threadMap.values()).sort((a, b) => new Date(b.lastMessageAt || 0).getTime() - new Date(a.lastMessageAt || 0).getTime());

  return (
    <main className="container-shell py-10">
      <div className="space-y-6">
        <div className="card">
          <h1 className="text-3xl font-bold text-text">Messages</h1>
          <p className="mt-2 text-sm text-muted">Direct messages with members you follow or connect with on Blackout Network.</p>
        </div>

        {threads.length ? (
          <div className="grid gap-4">
            {threads.map((thread) => (
              <Link key={thread.peerId} href={`/messages/${thread.peerUsername}`} className="card transition hover:border-white/20">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <h2 className="text-lg font-semibold text-text">{thread.peerDisplayName}</h2>
                      <span className="text-xs text-muted">@{thread.peerUsername}</span>
                      {thread.unreadCount > 0 ? <span className="rounded-full bg-brand px-2 py-1 text-[11px] font-semibold text-black">{thread.unreadCount} new</span> : null}
                    </div>
                    <p className="mt-3 line-clamp-2 text-sm text-muted">{thread.lastMessageFromMe ? "You: " : ""}{thread.lastMessage}</p>
                  </div>
                  <div className="shrink-0 text-xs text-muted">{formatTimestamp(thread.lastMessageAt)}</div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="card space-y-4">
            <p className="text-sm text-muted">No messages yet. Visit member profiles and start a conversation.</p>
            <div><Link href="/members" className="button-primary">Browse Members</Link></div>
          </div>
        )}
      </div>
    </main>
  );
}
