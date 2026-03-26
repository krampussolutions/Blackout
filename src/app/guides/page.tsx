import Link from "next/link";
import { guides } from "@/lib/guides";

export default function GuidesPage() {
  return (
    <main className="container-shell py-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="card">
          <p className="text-xs uppercase tracking-[0.22em] text-muted">Public guides</p>
          <h1 className="mt-4 text-3xl font-bold">Preparedness guides anyone can read</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-muted">
            These public guides are designed to help people understand the basics of blackout preparation,
            water storage, communications, lighting, and family readiness before they even join the network.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {guides.map((guide) => (
            <Link key={guide.slug} href={`/guides/${guide.slug}`} className="card block transition hover:border-brand/40">
              <p className="text-xs uppercase tracking-[0.18em] text-muted">Guide</p>
              <h2 className="mt-3 text-2xl font-semibold">{guide.title}</h2>
              <p className="mt-3 text-sm leading-7 text-muted">{guide.description}</p>
              <span className="mt-4 inline-flex text-sm font-medium text-text">Read guide →</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
