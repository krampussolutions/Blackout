import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/LogoutButton";

const links = [
  { href: "/feed", label: "Home" },
  { href: "/posts/new", label: "Create" },
  { href: "/groups", label: "Groups" },
  { href: "/members", label: "Members" },
];

export default async function Nav() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profileUsername: string | null = null;
  let membershipTier: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("username, membership_tier")
      .eq("id", user.id)
      .maybeSingle();

    profileUsername = profile?.username || (typeof user.user_metadata?.username === "string" ? user.user_metadata.username : null);
    membershipTier = profile?.membership_tier || null;
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-[#0b0f12]/95 backdrop-blur">
      <div className="container-shell flex items-center gap-4 py-3">
        <Link href="/" className="shrink-0 text-lg font-bold tracking-wide text-text">
          {siteConfig.name}
        </Link>

        <div className="hidden flex-1 md:block">
          <div className="max-w-md rounded-2xl border border-border bg-panelSoft px-4 py-2 text-sm text-muted">
            Search posts, topics, and members
          </div>
        </div>

        <nav className="ml-auto flex items-center gap-1 md:gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-xl px-3 py-2 text-sm text-muted transition hover:bg-panelSoft hover:text-text"
            >
              {link.label}
            </Link>
          ))}

          {user ? (
            <>
              <Link
                href={profileUsername ? `/profile/${profileUsername}` : "/feed"}
                className="rounded-xl px-3 py-2 text-sm text-muted transition hover:bg-panelSoft hover:text-text"
              >
                Profile
              </Link>
              <Link href="/settings/profile" className="rounded-xl px-3 py-2 text-sm text-muted transition hover:bg-panelSoft hover:text-text">
                Settings
              </Link>
              {membershipTier === "admin" ? (
                <Link href="/admin" className="rounded-xl px-3 py-2 text-sm text-muted transition hover:bg-panelSoft hover:text-text">
                  Admin
                </Link>
              ) : null}
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-xl px-3 py-2 text-sm text-muted transition hover:bg-panelSoft hover:text-text">
                Login
              </Link>
              <Link href="/signup" className="button-primary text-sm">
                Join
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
