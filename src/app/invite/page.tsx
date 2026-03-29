import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import InviteLinkCard from "@/components/InviteLinkCard";

export default async function InvitePage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect_to=/invite");

  const [{ count: inviteCount }, { data: profile }] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("invited_by", user.id),
    supabase.from("profiles").select("username, display_name").eq("id", user.id).maybeSingle(),
  ]);

  const shareText = `${profile?.display_name || profile?.username || "A member"} invited you to Blackout Network — a place for blackout prep, off-grid living, food storage, water, comms, and practical readiness.`;

  return (
    <main className="container-shell py-10">
      <div className="space-y-6">
        <div className="card">
          <p className="text-xs uppercase tracking-[0.18em] text-muted">Grow your circle</p>
          <h1 className="mt-3 text-3xl font-bold text-text">Invite people into Blackout Network</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">Use your invite link to bring in friends, family, local preparedness contacts, or group members. New signups created through your invite are tracked on your profile connection.</p>
          <div className="mt-5 inline-flex rounded-full border border-border bg-panelSoft px-4 py-2 text-sm text-text">Successful invites: {inviteCount ?? 0}</div>
        </div>

        <InviteLinkCard />

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="card">
            <h2 className="text-xl font-semibold text-text">Suggested message</h2>
            <p className="mt-3 rounded-2xl border border-border bg-panelSoft p-4 text-sm leading-6 text-muted">{shareText}</p>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold text-text">Where to use it</h2>
            <div className="mt-3 space-y-3 text-sm text-muted">
              <div className="rounded-2xl bg-panelSoft p-4">Send it to friends or family who prep with you.</div>
              <div className="rounded-2xl bg-panelSoft p-4">Share it in local weather, blackout, homestead, or radio circles where it fits naturally.</div>
              <div className="rounded-2xl bg-panelSoft p-4">Pair it with a useful tip, checklist, or group recommendation instead of dropping a cold link.</div>
            </div>
            <div className="mt-5">
              <Link href="/feed" className="button-secondary">Back to feed</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
