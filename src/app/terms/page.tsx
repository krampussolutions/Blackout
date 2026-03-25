import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use | Blackout Network",
  description: "Terms of Use for Blackout Network.",
};

export default function TermsPage() {
  return (
    <main className="container-shell py-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="card">
          <h1 className="text-3xl font-semibold">Terms of Use</h1>
          <p className="mt-4 text-sm leading-7 text-muted">
            By using Blackout Network, you agree to use the platform lawfully and in a way
            that does not harm the site, other members, or the public.
          </p>
        </div>

        <section className="card">
          <h2 className="text-xl font-semibold">Acceptable use</h2>
          <ul className="mt-4 space-y-2 text-sm leading-7 text-muted">
            <li>You must comply with applicable laws.</li>
            <li>You may not harass, threaten, impersonate, or defraud other users.</li>
            <li>You may not post spam, malware, or deceptive content.</li>
            <li>You may not use the site to organize or facilitate illegal activity.</li>
          </ul>
        </section>

        <section className="card">
          <h2 className="text-xl font-semibold">User content</h2>
          <p className="mt-4 text-sm leading-7 text-muted">
            You are responsible for the content you post. Blackout Network may remove,
            restrict, edit, or report content that violates site rules, applicable law, or
            advertising/publisher requirements.
          </p>
        </section>

        <section className="card">
          <h2 className="text-xl font-semibold">Accounts and enforcement</h2>
          <p className="mt-4 text-sm leading-7 text-muted">
            We may suspend or remove accounts, limit features, or take moderation action at
            our discretion when necessary for safety, abuse prevention, compliance, or site
            operation.
          </p>
        </section>

        <section className="card">
          <h2 className="text-xl font-semibold">No emergency, legal, or medical advice</h2>
          <p className="mt-4 text-sm leading-7 text-muted">
            Content on Blackout Network is for informational and community discussion
            purposes only. It is not legal, medical, emergency-response, or professional
            advice.
          </p>
        </section>
      </div>
    </main>
  );
}
