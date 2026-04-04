import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdSlot from "@/components/AdSlot";
import { getGuideBySlug, guides } from "@/lib/guides";

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
      <div className="relative aspect-[16/9] w-full">
        <Image src={src} alt={alt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 780px" />
      </div>
      {caption ? <figcaption className="px-4 py-3 text-sm text-muted">{caption}</figcaption> : null}
    </figure>
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
      <article className="mx-auto max-w-5xl space-y-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="space-y-6">
            <div className="card">
              <p className="text-xs uppercase tracking-[0.22em] text-muted">Preparedness guide</p>
              <h1 className="mt-4 text-3xl font-bold md:text-4xl">{guide.title}</h1>
              <p className="mt-4 text-base leading-7 text-muted md:text-lg">{guide.intro}</p>
            </div>

            {guide.coverImage ? <GuideImageBlock {...guide.coverImage} /> : null}

            <AdSlot title="Sponsored" variant="in-article" />

            {guide.sections.map((section, index) => (
              <div key={section.heading} className="space-y-6">
                <section id={buildSectionId(section.heading)} className="card scroll-mt-28">
                  <h2 className="text-2xl font-semibold">{section.heading}</h2>
                  <div className="mt-4 space-y-4">
                    {section.body.map((paragraph) => (
                      <p key={paragraph} className="text-sm leading-7 text-muted md:text-base">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {section.image ? <div className="mt-6"><GuideImageBlock {...section.image} /></div> : null}
                </section>

                {index === 3 || index === 7 ? <AdSlot title="Sponsored" variant="in-article" /> : null}
              </div>
            ))}
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
            <div className="card">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">In this guide</p>
              <div className="mt-4 space-y-2 text-sm">
                {guide.sections.map((section) => (
                  <a
                    key={section.heading}
                    href={`#${buildSectionId(section.heading)}`}
                    className="block rounded-xl bg-panelSoft px-3 py-3 text-muted transition hover:bg-panel hover:text-text"
                  >
                    {section.heading}
                  </a>
                ))}
              </div>
            </div>

            <div className="card">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Why this matters</p>
              <p className="mt-4 text-sm leading-7 text-muted">
                Good preparedness content should help someone make better decisions right now. This guide is designed
                to be practical enough for beginners without losing the details that matter during a real outage or
                evacuation.
              </p>
            </div>
          </aside>
        </div>
      </article>
    </main>
  );
}
