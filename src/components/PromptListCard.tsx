import Link from "next/link";

type PromptListCardProps = {
  title: string;
  description: string;
  prompts: string[];
  ctaHref?: string;
  ctaLabel?: string;
};

export default function PromptListCard({
  title,
  description,
  prompts,
  ctaHref = "/posts/new",
  ctaLabel = "Start a discussion",
}: PromptListCardProps) {
  return (
    <div className="card">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <h2 className="text-lg font-semibold text-text">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
        </div>
        <Link href={ctaHref} className="button-secondary">
          {ctaLabel}
        </Link>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {prompts.map((prompt) => (
          <div key={prompt} className="rounded-2xl border border-border bg-panelSoft px-4 py-4 text-sm leading-6 text-muted">
            {prompt}
          </div>
        ))}
      </div>
    </div>
  );
}
