import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdSlot from "@/components/AdSlot";
import { getGuideBySlug, guides } from "@/lib/guides";
import { siteConfig } from "@/lib/site";

export async function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return {};
  }

  const url = `${siteConfig.url.replace(/\/$/, "")}/guides/${guide.slug}`;

  return {
    title: `${guide.title} | Blackout Network`,
    description: guide.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: guide.title,
      description: guide.description,
      url,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: guide.title,
      description: guide.description,
    },
  };
}

function slugifyHeading(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function GuideImage({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  return (
    <figure className="overflow-hidden rounded-[24px] border border-white/10 bg-[#0f1c3b]">
      <img src={src} alt={alt} className="block h-auto w-full" />
      {caption ? (
        <figcaption className="border-t border-white/10 bg-white/[0.03] px-5 py-4 text-sm text-muted">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

function RichGuidePage({ guide }: { guide: NonNullable<ReturnType<typeof getGuideBySlug>> }) {
  const sections = guide.sections.map((section) => ({
    ...section,
    id: section.id ?? slugifyHeading(section.heading),
  }));

  return (
    <main className="container-shell py-8 md:py-10">
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_300px] xl:items-start">
        <article className="space-y-6">
          <section className="card space-y-4">
            <p className="text-xs uppercase tracking-[0.22em] text-muted">Preparedness guide</p>
            <h1 className="text-3xl font-bold leading-tight md:text-4xl">{guide.title}</h1>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted">
              <span>Blackout Network</span>
              {guide.publishedLabel ? <span>• {guide.publishedLabel}</span> : null}
              {guide.updatedLabel ? <span>• {guide.updatedLabel}</span> : null}
              {guide.readTime ? <span>• {guide.readTime}</span> : null}
            </div>
            <p className="max-w-3xl text-base leading-8 text-muted">{guide.intro}</p>
          </section>

          {guide.coverImageSrc ? (
            <GuideImage
              src={guide.coverImageSrc}
              alt={guide.coverImageAlt ?? guide.title}
              caption={guide.coverImageCaption}
            />
          ) : null}

          {guide.quickChecklist?.length ? (
            <section className="card">
              <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-muted">Quick checklist</p>
                  <h2 className="mt-2 text-2xl font-semibold">What to cover first</h2>
                </div>
                <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                  Start here
                </span>
              </div>
              <ul className="mt-5 space-y-3">
                {guide.quickChecklist.map((item) => (
                  <li key={item} className="flex gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                    <span className="mt-[2px] text-accent">✓</span>
                    <span className="text-sm leading-7 text-text/90">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {sections.map((section, index) => (
            <div key={section.id} className="space-y-6">
              {index === 2 ? <AdSlot title="Sponsored" variant="wide" /> : null}
              <section id={section.id} className="card scroll-mt-24 space-y-5">
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.22em] text-muted">Section {index + 1}</p>
                  <h2 className="text-2xl font-semibold md:text-[2rem]">{section.heading}</h2>
                  {section.summary ? (
                    <p className="max-w-3xl text-sm leading-7 text-text/85">{section.summary}</p>
                  ) : null}
                </div>

                {section.imageSrc ? (
                  <GuideImage
                    src={section.imageSrc}
                    alt={section.imageAlt ?? section.heading}
                    caption={section.imageCaption}
                  />
                ) : null}

                <div className="space-y-4">
                  {section.body.map((paragraph) => (
                    <p key={paragraph} className="text-sm leading-8 text-muted">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {section.bullets?.length ? (
                  <div className="grid gap-3 md:grid-cols-1">
                    {section.bullets.map((bullet) => (
                      <div
                        key={bullet}
                        className="flex gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3"
                      >
                        <span className="mt-[2px] text-accent">•</span>
                        <p className="text-sm leading-7 text-text/90">{bullet}</p>
                      </div>
                    ))}
                  </div>
                ) : null}
              </section>
            </div>
          ))}

          <AdSlot title="Sponsored" variant="wide" />

          <section className="card">
            <p className="text-xs uppercase tracking-[0.22em] text-muted">Final thoughts</p>
            <h2 className="mt-3 text-2xl font-semibold">Preparedness works better when it is easy to maintain</h2>
            <p className="mt-4 text-sm leading-8 text-muted">
              A strong guide is only useful if it turns into a setup you can actually keep current. Start with a realistic baseline,
              review it on a schedule, and improve the weak spots the next time you use it.
            </p>
          </section>
        </article>

        <aside className="space-y-5 xl:sticky xl:top-24">
          <section className="card">
            <p className="text-xs uppercase tracking-[0.22em] text-muted">In this guide</p>
            <ol className="mt-4 space-y-3">
              {sections.map((section, index) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="block rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm leading-6 text-text/85 transition hover:border-accent/40 hover:text-text"
                  >
                    <span className="mr-2 text-accent">{index + 1}.</span>
                    {section.heading}
                  </a>
                </li>
              ))}
            </ol>
          </section>

          <section className="card space-y-3">
            <p className="text-xs uppercase tracking-[0.22em] text-muted">Pro tip</p>
            <p className="text-sm leading-7 text-muted">
              Build the system once, label it clearly, and set a recurring reminder to review it before storm season or major weather swings.
            </p>
          </section>
        </aside>
      </div>
    </main>
  );
}

function SimpleGuidePage({ guide }: { guide: NonNullable<ReturnType<typeof getGuideBySlug>> }) {
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

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  if (guide.quickChecklist?.length || guide.coverImageSrc) {
    return <RichGuidePage guide={guide} />;
  }

  return <SimpleGuidePage guide={guide} />;
}
