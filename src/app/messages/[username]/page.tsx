import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import MessageComposer from "@/components/MessageComposer";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type MessageThreadPageProps = {
  params: Promise<{ username: string }>;
};

function formatMessageTime(value: string) {
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function MessageThreadPage({ params }: MessageThreadPageProps) {
  const { username: rawUsername } = await params;
  const username = rawUsername.trim().toLowerCase();

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?redirect_to=/messages/${username}`);
  }

  const { data: peer } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url, bio")
    .ilike("username", username)
    .maybeSingle();

  if (!peer) {
    notFound();
  }

  await supabase
    .from("direct_messages")
    .update({ read_at: new Date().toISOString() })
    .eq("sender_id", peer.id)
    .eq("recipient_id", user.id)
    .is("read_at", null);

  const { data: messages } = await supabase
    .from("direct_messages")
    .select("id, sender_id, recipient_id, content, created_at, read_at")
    .or(`and(sender_id.eq.${user.id},recipient_id.eq.${peer.id}),and(sender_id.eq.${peer.id},recipient_id.eq.${user.id})`)
    .order("created_at", { ascending: true })
    .limit(200);

  return (
    <main className="container-shell py-10">
      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="space-y-4">
          <div className="card">
            <Link href="/messages" className="text-sm text-muted hover:text-text">← Back to inbox</Link>
            <div className="mt-4 flex items-center gap-3">
              <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-panelSoft font-semibold text-text">
                {peer.avatar_url ? (
                  <Image src={peer.avatar_url} alt={peer.display_name || peer.username} fill className="object-cover" />
                ) : (
                  peer.username.slice(0, 2).toUpperCase()
                )}
              </div>
              <div>
                <h1 className="text-xl font-semibold text-text">{peer.display_name || peer.username}</h1>
                <p className="text-sm text-muted">@{peer.username}</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-muted">{peer.bio || "Preparedness-minded member."}</p>
            <div className="mt-4 flex gap-3">
              <Link href={`/profile/${peer.username}`} className="button-secondary">View profile</Link>
            </div>
          </div>
        </aside>

        <section className="space-y-4">
          <div className="card space-y-4">
            <div className="flex items-center justify-between gap-3 border-b border-border pb-3">
              <div>
                <h2 className="text-lg font-semibold text-text">Conversation</h2>
                <p className="text-sm text-muted">Direct messages are private between you and @{peer.username}.</p>
              </div>
            </div>

            {messages?.length ? messages.map((message) => {
  const isMine = message.sender_id === user.id;
  return (
    <div key={message.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${isMine ? "bg-emerald-700 text-white" : "bg-panelSoft text-text"}`}>
        <p>{message.content}</p>
        <div className={`mt-2 text-[11px] ${isMine ? "text-white/80" : "text-muted"}`}>
          {formatMessageTime(message.created_at)}{isMine ? message.read_at ? " • Read" : " • Sent" : ""}
        </div>
      </div>
    </div>
  );
}) : <div className="rounded-2xl border border-dashed border-border p-6 text-sm text-muted">No messages yet. Start the conversation below.</div>}
            </div>
          </div>

          <MessageComposer recipientId={peer.id} recipientUsername={peer.username} />
        </section>
      </div>
    </main>
  );
}
