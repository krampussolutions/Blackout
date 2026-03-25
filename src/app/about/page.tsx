import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Blackout Network",
  description: "Learn what Blackout Network is, who it serves, and how the community is meant to be used.",
};

export default function AboutPage() {
  return (
    <main className="container-shell py-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="card">
          <h1 className="text-3xl font-semibold">About Blackout Network</h1>
          <p className="mt-4 text-sm leading-7 text-muted">
            Blackout Network is a preparedness-focused social platform for preppers,
            survivalists, homesteaders, off-grid families, and people who want to become
            more self-reliant. The goal is to give members a place to share practical
            experience, discuss gear, learn skills, and build resilient communities.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <section className="card">
            <h2 className="text-xl font-semibold">Who it is for</h2>
            <ul className="mt-4 space-y-2 text-sm leading-7 text-muted">
              <li>People building emergency preparedness plans</li>
              <li>Members interested in power outage readiness and backup systems</li>
              <li>Homesteaders and off-grid families</li>
              <li>Anyone learning food storage, water, communications, and self-reliance</li>
            </ul>
          </section>

          <section className="card">
            <h2 className="text-xl font-semibold">What belongs here</h2>
            <ul className="mt-4 space-y-2 text-sm leading-7 text-muted">
              <li>Preparedness planning and skill-sharing</li>
              <li>Field-tested gear experiences and reviews</li>
              <li>Questions, guides, and local resilience discussion</li>
              <li>Respectful conversation built around practical readiness</li>
            </ul>
          </section>
        </div>

        <section className="card">
          <h2 className="text-xl font-semibold">What Blackout Network is not</h2>
          <p className="mt-4 text-sm leading-7 text-muted">
            Blackout Network is not a place for illegal activity, threats, harassment,
            doxxing, scams, or explicit instructions that help people commit violence or
            other crimes. Members are expected to use the platform responsibly and within
            the law.
          </p>
        </section>
      </div>
    </main>
  );
}
