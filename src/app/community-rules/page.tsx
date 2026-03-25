import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community Rules | Blackout Network",
  description: "Community rules and posting standards for Blackout Network.",
};

export default function CommunityRulesPage() {
  return (
    <main className="container-shell py-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="card">
          <h1 className="text-3xl font-semibold">Community Rules</h1>
          <p className="mt-4 text-sm leading-7 text-muted">
            Blackout Network is built for practical preparedness, respectful discussion,
            and resilient communities. These rules explain what users can and cannot do.
          </p>
        </div>

        <section className="card">
          <h2 className="text-xl font-semibold">Allowed content</h2>
          <ul className="mt-4 space-y-2 text-sm leading-7 text-muted">
            <li>Preparedness planning and self-reliance discussion</li>
            <li>Power outage, water, food storage, radio, first aid, and off-grid topics</li>
            <li>Questions, tutorials, personal experience, and gear discussion</li>
            <li>Respectful debate and constructive problem-solving</li>
          </ul>
        </section>

        <section className="card">
          <h2 className="text-xl font-semibold">Not allowed</h2>
          <ul className="mt-4 space-y-2 text-sm leading-7 text-muted">
            <li>Harassment, hate, intimidation, or threats</li>
            <li>Doxxing or sharing private personal information</li>
            <li>Spam, scams, impersonation, or deceptive promotions</li>
            <li>Graphic sexual content or pornography</li>
            <li>Explicit criminal planning or content that helps people commit violent wrongdoing</li>
            <li>Illegal sales, trafficking, or unlawful instructions</li>
          </ul>
        </section>

        <section className="card">
          <h2 className="text-xl font-semibold">Moderation</h2>
          <p className="mt-4 text-sm leading-7 text-muted">
            Posts and accounts may be reviewed, restricted, or removed if they violate these
            rules, platform terms, or advertiser requirements. Users can report content
            directly through the site.
          </p>
        </section>
      </div>
    </main>
  );
}
