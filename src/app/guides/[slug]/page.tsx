import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdSlot from "@/components/AdSlot";
import {
  getGuideBySlug,
  getRelatedGuides,
  guides,
  type GuideChecklistGroup,
  type GuideSection,
} from "@/lib/guides";
import { siteConfig } from "@/lib/site";

const baseUrl = siteConfig.url.replace(/\/$/, "");

function buildSectionId(heading: string) {
  return heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function toAbsoluteUrl(path: string) {
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

function formatDate(date: string) {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function estimateReadingMinutes(sectionCount: number, paragraphCount: number) {
  return Math.max(4, Math.round((sectionCount * 180 + paragraphCount * 90) / 200));
}

export async function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return {};
  }

  const title = guide.seoTitle || guide.title;
  const description = guide.seoDescription || guide.description;
  const canonicalUrl = `${baseUrl}/guides/${guide.slug}`;
  const images = guide.coverImage ? [{ url: toAbsoluteUrl(guide.coverImage.src), alt: guide.coverImage.alt }] : undefined;

  return {
    title: `${title} | Blackout Network`,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${title} | Blackout Network`,
      description,
      url: canonicalUrl,
      type: "article",
      images,
      authors: guide.authorName ? [guide.authorName] : undefined,
      publishedTime: guide.publishedAt,
      modifiedTime: guide.updatedAt,
    },
    twitter: {
      card: images?.length ? "summary_large_image" : "summary",
      title: `${title} | Blackout Network`,
      description,
      images: images?.map((image) => image.url),
    },
  };
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

  const title = guide.seoTitle || guide.title;
  const description = guide.seoDescription || guide.description;
  const canonicalUrl = `${baseUrl}/guides/${guide.slug}`;
  const readingMinutes = guide.readingMinutes || estimateReadingMinutes(guide.sections.length, guide.sections.reduce((sum, section) => sum + section.body.length, 0));
  const relatedGuides = getRelatedGuides(guide, 3);
  const publishedLabel = guide.publishedAt ? formatDate(guide.publishedAt) : null;
  const updatedLabel = guide.updatedAt ? formatDate(guide.updatedAt) : publishedLabel;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    mainEntityOfPage: canonicalUrl,
    image: guide.coverImage ? [toAbsoluteUrl(guide.coverImage.src)] : undefined,
    datePublished: guide.publishedAt,
    dateModified: guide.updatedAt || guide.publishedAt,
    author: {
      "@type": "Organization",
      name: guide.authorName || siteConfig.name,
      url: baseUrl,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: baseUrl,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/og-image.png`,
      },
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Guides",
        item: `${baseUrl}/guides`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: guide.title,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <main className="container-shell py-10">
      <article className="mx-auto max-w-6xl space-y-6">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

        <nav aria-label="Breadcrumb" className="text-sm text-muted">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="transition hover:text-text">Home</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/guides" className="transition hover:text-text">Guides</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-text">{guide.title}</li>
          </ol>
        </nav>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="space-y-6">
            <header className="card">
              <p className="text-xs uppercase tracking-[0.22em] text-muted">Preparedness guide</p>
              <h1 className="mt-4 text-3xl font-bold md:text-4xl">{title}</h1>
              <p className="mt-4 text-base leading-7 text-muted md:text-lg">{guide.intro}</p>
              <div className="mt-5 flex flex-wrap gap-3 text-sm text-muted">
                <span className="rounded-full border border-white/10 bg-panelSoft px-3 py-1.5">By {guide.authorName || siteConfig.name}</span>
                {updatedLabel ? <span className="rounded-full border border-white/10 bg-panelSoft px-3 py-1.5">Updated {updatedLabel}</span> : null}
                <span className="rounded-full border border-white/10 bg-panelSoft px-3 py-1.5">{readingMinutes} min read</span>
              </div>
              <p className="mt-5 text-sm leading-6 text-muted">
                This guide is built for practical home preparedness and meant to help you take action before the next blackout,
                storm, or short-term emergency.
              </p>
            </header>

            {guide.coverImage ? <GuideImageBlock {...guide.coverImage} /> : null}

            {guide.quickChecklist?.length ? (
              <section className="card" aria-labelledby="quick-start-title">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Scan this first</p>
                    <h2 id="quick-start-title" className="mt-2 text-2xl font-semibold">Quick checklist</h2>
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
              <section key={section.heading} id={buildSectionId(section.heading)} className="card scroll-mt-28" aria-labelledby={`${buildSectionId(section.heading)}-title`}>
                <div className="flex flex-col gap-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Section {index + 1}</p>
                    <h2 id={`${buildSectionId(section.heading)}-title`} className="mt-2 text-2xl font-semibold">{section.heading}</h2>
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

                {index === 5 ? (
                  <div className="mt-6">
                    <AdSlot title="Sponsored" variant="in-article" />
                  </div>
                ) : null}
              </section>
            ))}

            {guide.faqs?.length ? (
              <section className="card" aria-labelledby="guide-faq-title">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Common questions</p>
                <h2 id="guide-faq-title" className="mt-2 text-2xl font-semibold">Questions people ask about this topic</h2>
                <div className="mt-5 space-y-4">
                  {guide.faqs.map((faq) => (
                    <div key={faq.question} className="rounded-2xl border border-white/10 bg-panelSoft p-4">
                      <h3 className="text-base font-semibold text-text">{faq.question}</h3>
                      <p className="mt-2 text-sm leading-7 text-muted md:text-base">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
              <div className="card" aria-labelledby="related-guides-title">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Keep reading</p>
                <h2 id="related-guides-title" className="mt-2 text-2xl font-semibold">Related preparedness guides</h2>
                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {relatedGuides.map((relatedGuide) => (
                    <Link
                      key={relatedGuide.slug}
                      href={`/guides/${relatedGuide.slug}`}
                      className="rounded-2xl border border-white/10 bg-panelSoft p-4 transition hover:border-brand/40 hover:bg-panel"
                    >
                      <p className="text-xs uppercase tracking-[0.18em] text-muted">Guide</p>
                      <h3 className="mt-2 text-lg font-semibold text-text">{relatedGuide.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-muted">{relatedGuide.description}</p>
                      <span className="mt-4 inline-flex text-sm font-medium text-text">Read guide →</span>
                    </Link>
                  ))}
                </div>
              </div>

              <aside className="card">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Join the network</p>
                <h2 className="mt-2 text-2xl font-semibold">{guide.joinCtaTitle || "Preparedness is better with a network"}</h2>
                <p className="mt-3 text-sm leading-7 text-muted md:text-base">
                  {guide.joinCtaBody ||
                    "Create a free account to follow preparedness discussions, join groups, and keep learning beyond the guide."}
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link href="/join" className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90">
                    Join free
                  </Link>
                  <Link href="/guides" className="rounded-xl border border-white/10 bg-panelSoft px-4 py-2 text-sm font-semibold text-text transition hover:border-white/20 hover:bg-panel">
                    Browse all guides
                  </Link>
                </div>
              </aside>
            </section>
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
                <li>Open a related guide when you are ready to go deeper on water, lighting, or communications.</li>
              </ul>
            </div>
          </aside>
        </div>
      </article>
    </main>
  );
}
