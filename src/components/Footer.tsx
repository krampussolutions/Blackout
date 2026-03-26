import Link from "next/link";

const footerLinks = [
  { href: "/about", label: "About" },
  { href: "/guides", label: "Guides" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Use" },
  { href: "/community-rules", label: "Community Rules" },
  { href: "/safety", label: "Safety & Reporting" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="container-shell py-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-muted">
            Blackout Network • Built for preparedness, self-reliance, and resilient communities.
          </p>

          <nav className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted">
            {footerLinks.map((link) => (
              <Link key={link.href} href={link.href} className="transition hover:text-text">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
