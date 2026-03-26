export default function SafetyPage() {
  return (
    <main className="container-shell py-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="card">
          <h1 className="text-3xl font-semibold">Safety & Reporting</h1>
          <p className="mt-4 text-sm leading-7 text-muted">
            Blackout Network is moderated. Members can report posts that look like spam,
            harassment, scams, impersonation, illegal activity, or dangerous rule-breaking content.
          </p>
        </div>

        <section className="card">
          <h2 className="text-xl font-semibold">How reporting works</h2>
          <ul className="mt-4 space-y-2 text-sm leading-7 text-muted">
            <li>Use the Report button on a post when something needs moderator review.</li>
            <li>Reports go into an admin queue for review, action, or dismissal.</li>
            <li>Repeated abuse, spam, or harmful behavior may lead to content removal or account restrictions.</li>
          </ul>
        </section>

        <section className="card">
          <h2 className="text-xl font-semibold">What to report</h2>
          <ul className="mt-4 space-y-2 text-sm leading-7 text-muted">
            <li>Harassment, threats, or hateful conduct</li>
            <li>Scams, impersonation, or deceptive promotions</li>
            <li>Illegal activity or explicit instructions that help people commit crimes</li>
            <li>Doxxing or sharing private personal information</li>
          </ul>
        </section>

        <section className="card">
          <h2 className="text-xl font-semibold">Emergency reminder</h2>
          <p className="mt-4 text-sm leading-7 text-muted">
            Content on Blackout Network is for informational discussion only. It is not a substitute for
            medical care, legal advice, or emergency response services.
          </p>
        </section>
      </div>
    </main>
  );
}
