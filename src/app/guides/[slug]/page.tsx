import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdSlot from "@/components/AdSlot";
import { getGuideBySlug, guides, type GuideChecklistGroup, type GuideSection } from "@/lib/guides";

export async function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return {};
  }

  return {
    title: `${guide.title} | Blackout Network Guides`,
    description: guide.description,
    openGraph: {
      title: `${guide.title} | Blackout Network Guides`,
      description: guide.description,
      url: `https://www.blackout-network.com/guides/${guide.slug}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${guide.title} | Blackout Network Guides`,
      description: guide.description,
    },
  };
}

function buildSectionId(heading: string) {
  return heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function GuideImageBlock({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  return (
    <figure className="overflow-hidden rounded-3xl border border-white/10 bg-panelSoft">
      <div className="relative aspect-[16/9] w-full bg-[#0f1628]">
        <Image src={src} alt={alt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 780px" />
      </div>
      {caption ? <figcaption className="border-t border-white/10 px-4 py-3 text-sm text-muted">{caption}</figcaption> : null}
    </figure>
  );
}

function ChecklistGroup({ title, items }: GuideChecklistGroup) {
  return (
    <div className="rounded-2xl border border-white/10 bg-panelSoft p-4">
      <p className="text-sm font-semibold text-text">{title}</p>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-0.5 text-accent">✓</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SectionChecklist({ section }: { section: GuideSection }) {
  if (!section.bullets?.length) {
    return null;
  }

  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-panelSoft p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Quick checklist</p>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-muted md:text-base">
        {section.bullets.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-0.5 text-accent">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  return (
    <main className="container-shell py-10">
      <article className="mx-auto max-w-6xl space-y-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="space-y-6">
            <div className="card">
              <p className="text-xs uppercase tracking-[0.22em] text-muted">Preparedness guide</p>
              <h1 className="mt-4 text-3xl font-bold md:text-4xl">{guide.title}</h1>
              <p className="mt-4 text-base leading-7 text-muted md:text-lg">{guide.intro}</p>
            </div>

            {guide.coverImage ? <GuideImageBlock {...guide.coverImage} /> : null}

            {guide.quickChecklist?.length ? (
              <section className="card">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Scan this first</p>
                    <h2 className="mt-2 text-2xl font-semibold">Quick checklist</h2>
                  </div>
                  <p className="max-w-2xl text-sm leading-6 text-muted">
                    Use this as your fast-start list, then work through the full sections below to tailor the plan to your
                    household, storage space, daily needs, and backup options.
                  </p>
                </div>
                <div className="mt-5 grid gap-4 lg:grid-cols-3">
                  {guide.quickChecklist.map((group) => (
                    <ChecklistGroup key={group.title} {...group} />
                  ))}
                </div>
              </section>
            ) : null}

            <AdSlot title="Sponsored" variant="in-article" />

            {guide.sections.map((section, index) => (
              <section key={section.heading} id={buildSectionId(section.heading)} className="card scroll-mt-28">
                <div className="flex flex-col gap-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Section {index + 1}</p>
                    <h2 className="mt-2 text-2xl font-semibold">{section.heading}</h2>
                  </div>

                  {section.image ? <GuideImageBlock {...section.image} /> : null}

                  <SectionChecklist section={section} />

                  <div className="space-y-4">
                    {section.body.map((paragraph) => (
                      <p key={paragraph} className="text-sm leading-7 text-muted md:text-base">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                {index === 5 ? <div className="mt-6"><AdSlot title="Sponsored" variant="in-article" /></div> : null}
              </section>
            ))}
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
            <nav className="card" aria-label="Guide sections">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">In this guide</p>
              <ol className="mt-4 space-y-2 text-sm">
                {guide.sections.map((section, index) => (
                  <li key={section.heading}>
                    <a
                      href={`#${buildSectionId(section.heading)}`}
                      className="flex items-start gap-3 rounded-xl border border-white/8 bg-panelSoft px-3 py-3 text-muted transition hover:border-white/15 hover:bg-panel hover:text-text"
                    >
                      <span className="min-w-5 text-xs font-semibold text-accent">{index + 1}</span>
                      <span>{section.navLabel || section.heading}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="card">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Use this page well</p>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-muted">
                <li>Start with the quick checklist, then fill in the household-specific gaps below.</li>
                <li>Use the section links to jump back during outages, seasonal reviews, or restocking.</li>
                <li>Review your supplies on a simple schedule so the plan stays practical instead of theoretical.</li>
              </ul>
            </div>
          </aside>
        </div>
      </article>
    </main>
  );
}
