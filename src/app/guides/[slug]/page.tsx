import { notFound } from "next/navigation";
import { getGuideBySlug, guides } from "@/lib/guides";

export async function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  return (
    <main className="container-shell py-10">
      <article className="mx-auto max-w-4xl space-y-6">
        <div className="card">
          <p className="text-xs uppercase tracking-[0.22em] text-muted">Preparedness guide</p>
          <h1 className="mt-4 text-3xl font-bold">{guide.title}</h1>
          <p className="mt-4 text-base leading-7 text-muted">{guide.intro}</p>
        </div>

        {guide.sections.map((section) => (
          <section key={section.heading} className="card">
            <h2 className="text-2xl font-semibold">{section.heading}</h2>
            <div className="mt-4 space-y-4">
              {section.body.map((paragraph) => (
                <p key={paragraph} className="text-sm leading-7 text-muted">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </article>
    </main>
  );
}
