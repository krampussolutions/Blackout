import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/LogoutButton";

const publicLinks = [
  { href: "/about", label: "About" },
  { href: "/community-rules", label: "Rules" },
  { href: "/contact", label: "Contact" },
];

const memberLinks = [
  { href: "/feed", label: "Feed" },
  { href: "/members", label: "Members" },
  { href: "/groups", label: "Groups" },
  { href: "/messages", label: "Messages" },
  { href: "/posts/new", label: "Create" },
];

export default async function Nav() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profileUsername: string | null = null;
  let membershipTier = "free";
  let unreadCount = 0;

  if (user) {
    const [{ data: profile }, { count }] = await Promise.all([
      supabase.from("profiles").select("username, membership_tier").eq("id", user.id).maybeSingle(),
      supabase.from("direct_messages").select("id", { count: "exact", head: true }).eq("recipient_id", user.id).is("read_at", null),
    ]);

    profileUsername = profile?.username ?? null;
    membershipTier = profile?.membership_tier ?? "free";
    unreadCount = count ?? 0;
  }

  const links = user ? memberLinks : publicLinks;

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur">
      <div className="container-shell flex items-center justify-between gap-4 py-3">
        <div>
          <Link href="/" className="text-lg font-bold tracking-wide text-text">Blackout Network</Link>
          <p className="text-xs uppercase tracking-[0.18em] text-muted">Preparedness community</p>
        </div>

        <nav className="ml-auto flex items-center gap-1 md:gap-2">
          {links.map((link) => {
            const isMessages = link.href === "/messages";
            return (
              <Link key={link.href} href={link.href} className="rounded-xl px-3 py-2 text-sm text-muted transition hover:bg-panelSoft hover:text-text">
                <span className="inline-flex items-center gap-2">
                  {link.label}
                  {isMessages && unreadCount > 0 ? (
                    <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-semibold text-black">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  ) : null}
                </span>
              </Link>
            );
          })}

          {user ? (
            <>
              <Link href={profileUsername ? `/profile/${profileUsername}` : "/feed"} className="rounded-xl px-3 py-2 text-sm text-muted transition hover:bg-panelSoft hover:text-text">Profile</Link>
              <Link href="/settings/profile" className="rounded-xl px-3 py-2 text-sm text-muted transition hover:bg-panelSoft hover:text-text">Settings</Link>
              {membershipTier === "admin" ? <Link href="/admin" className="rounded-xl px-3 py-2 text-sm text-muted transition hover:bg-panelSoft hover:text-text">Admin</Link> : null}
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-xl px-3 py-2 text-sm text-muted transition hover:bg-panelSoft hover:text-text">Login</Link>
              <Link href="/signup" className="button-primary text-sm">Join</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
