import Link from "next/link";

export default function JoinPage() {
  return (
    <main className="container-shell py-12">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="card text-center">
          <p className="text-xs uppercase tracking-[0.22em] text-muted">Preparedness community</p>
          <h1 className="mt-4 text-4xl font-bold text-text">Join Blackout Network</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted">
            Blackout Network is a social platform for people preparing for outages, storms,
            emergencies, off-grid living, food storage, communications, and resilient communities.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/signup" className="button-primary">Create account</Link>
            <Link href="/login" className="button-secondary">Log in</Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="card">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">Share practical knowledge</h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              Post questions, blackout prep lessons, field-tested gear ideas, and household readiness systems.
            </p>
          </div>
          <div className="card">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">Find your people</h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              Follow other preparedness-minded members and connect around common interests and local conditions.
            </p>
          </div>
          <div className="card">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">Explore groups and guides</h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              Join focused groups, read public guides, and learn faster from organized preparedness topics.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
