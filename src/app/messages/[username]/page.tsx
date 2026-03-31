import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import RealtimeMessageThread from "@/components/RealtimeMessageThread";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type MessageThreadPageProps = {
  params: Promise<{ username: string }>;
};

export default async function MessageThreadPage({
  params,
}: MessageThreadPageProps) {
  const { username: rawUsername } = await params;
  const username = rawUsername.trim().toLowerCase();

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
    .or(
      `and(sender_id.eq.${user.id},recipient_id.eq.${peer.id}),and(sender_id.eq.${peer.id},recipient_id.eq.${user.id})`
    )
    .order("created_at", { ascending: true })
    .limit(200);

  return (
    <main className="container-shell py-10">
      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="space-y-4">
          <div className="card">
            <Link href="/messages" className="text-sm text-muted hover:text-text">
              ← Back to inbox
            </Link>

            <div className="mt-4 flex items-center gap-3">
              <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-panelSoft font-semibold text-text">
                {peer.avatar_url ? (
                  <Image
                    src={peer.avatar_url}
                    alt={peer.display_name || peer.username}
                    fill
                    className="object-cover"
                  />
                ) : (
                  peer.username.slice(0, 2).toUpperCase()
                )}
              </div>

              <div>
                <h1 className="text-xl font-semibold text-text">
                  {peer.display_name || peer.username}
                </h1>
                <p className="text-sm text-muted">@{peer.username}</p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-muted">
              {peer.bio || "Preparedness-minded member."}
            </p>

            <div className="mt-4 flex gap-3">
              <Link href={`/profile/${peer.username}`} className="button-secondary">
                View profile
              </Link>
            </div>
          </div>
        </aside>

        <section className="space-y-4">
          <RealtimeMessageThread
            currentUserId={user.id}
            peerId={peer.id}
            peerUsername={peer.username}
            initialMessages={(messages || []) as any}
          />
        </section>
      </div>
    </main>
  );
}
