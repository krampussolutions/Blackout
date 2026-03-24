import Link from "next/link";
import { siteConfig } from "@/lib/site";

const links = [
  { href: "/feed", label: "Home" },
  { href: "/posts/new", label: "Create" },
  { href: "/groups", label: "Groups" },
  { href: "/members", label: "Members" },
  { href: "/profile/ridgewalker", label: "Profile" }
];

export default function Nav() {
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
          <Link href="/login" className="rounded-xl px-3 py-2 text-sm text-muted transition hover:bg-panelSoft hover:text-text">
            Login
          </Link>
          <Link href="/signup" className="button-primary text-sm">
            Join
          </Link>
        </nav>
      </div>
    </header>
  );
}
