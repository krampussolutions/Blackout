import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Blackout Network",
  description: "Contact Blackout Network for support, moderation issues, business questions, or legal requests.",
};

export default function ContactPage() {
  return (
    <main className="container-shell py-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="card">
          <h1 className="text-3xl font-semibold">Contact</h1>
          <p className="mt-4 text-sm leading-7 text-muted">
            For support, moderation questions, business inquiries, or legal requests,
            contact us by email. You can also use the in-app Report button on posts. Include your username
            and the page or post involved when reporting an issue so we can review it faster.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <section className="card">
            <h2 className="text-xl font-semibold">General Support</h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              Account issues, login problems, profile questions, and general site help.
            </p>
            <a
              href="mailto:support@blackout-network.com"
              className="mt-4 inline-flex text-sm font-medium text-white hover:opacity-80"
            >
              support@blackout-network.com
            </a>
          </section>

          <section className="card">
            <h2 className="text-xl font-semibold">Moderation & Safety</h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              Report content concerns, harassment, spam, impersonation, or other rule
              violations.
            </p>
            <a
              href="mailto:moderation@blackout-network.com"
              className="mt-4 inline-flex text-sm font-medium text-white hover:opacity-80"
            >
              moderation@blackout-network.com
            </a>
          </section>

          <section className="card">
            <h2 className="text-xl font-semibold">Business</h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              Partnerships, media, and business-related communication.
            </p>
            <a
              href="mailto:business@blackout-network.com"
              className="mt-4 inline-flex text-sm font-medium text-white hover:opacity-80"
            >
              business@blackout-network.com
            </a>
          </section>

          <section className="card">
            <h2 className="text-xl font-semibold">Legal & Privacy</h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              Legal requests, privacy requests, and account data questions.
            </p>
            <a
              href="mailto:legal@blackout-network.com"
              className="mt-4 inline-flex text-sm font-medium text-white hover:opacity-80"
            >
              legal@blackout-network.com
            </a>
          </section>
        </div>
      </div>
    </main>
  );
}
