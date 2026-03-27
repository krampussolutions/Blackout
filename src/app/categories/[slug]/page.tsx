import type { Metadata } from "next";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { normalizeCategorySlug } from "@/lib/category-aliases";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { siteConfig } from "@/lib/site";

async function getCategoryData(rawSlug: string) {
  const supabase = await createSupabaseServerClient();
  const normalizedSlug = normalizeCategorySlug(rawSlug);

  const { data: category } = await supabase
    .from("categories")
    .select("id, name, slug, description")
    .eq("slug", normalizedSlug)
    .maybeSingle();

  return { supabase, normalizedSlug, category };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { category, normalizedSlug } = await getCategoryData(slug);

  if (!category) {
    return {
      title: `${siteConfig.name} | Preparedness Community`,
      description: siteConfig.description,
    };
  }

  const canonicalUrl = `${siteConfig.url.replace(/\/$/, "")}/categories/${normalizedSlug}`;
  const description = category.description || `Preparedness posts and resources for ${category.name}.`;

  return {
    title: `${category.name} | ${siteConfig.name}`,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${category.name} | ${siteConfig.name}`,
      description,
      url: canonicalUrl,
      siteName: siteConfig.name,
      type: "website",
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { supabase, normalizedSlug, category } = await getCategoryData(slug);

  if (slug !== normalizedSlug) {
    redirect(`/categories/${normalizedSlug}`);
  }

  if (!category) {
    notFound();
  }

  const [{ data: posts }, { count: postCount }] = await Promise.all([
    supabase
      .from("posts")
      .select(
        "id, title, content, created_at, profiles!posts_user_id_fkey(username, display_name)",
      )
      .eq("category_id", category.id)
      .order("created_at", { ascending: false })
      .limit(8),
    supabase
      .from("posts")
      .select("id", { count: "exact", head: true })
      .eq("category_id", category.id),
  ]);

  return (
    <main className="container-shell py-12">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="card">
          <p className="text-xs uppercase tracking-[0.18em] text-muted">Preparedness category</p>
          <h1 className="mt-3 text-3xl font-bold">{category.name}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
            {category.description || `Browse posts and preparedness discussions related to ${category.name}.`}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href={`/feed?category=${category.slug}`} className="button-primary">Open in feed</Link>
            <Link href="/guides" className="button-secondary">Browse public guides</Link>
          </div>
          <p className="mt-4 text-xs uppercase tracking-[0.18em] text-muted">{postCount || 0} public posts</p>
        </div>

        <div className="grid gap-4">
          {posts?.length ? posts.map((post) => {
            const author = Array.isArray(post.profiles) ? post.profiles[0] : post.profiles;
            return (
              <Link key={post.id} href={`/posts/${post.id}`} className="card block transition hover:border-brand/40">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold">{post.title}</h2>
                    <p className="mt-2 text-sm text-muted">
                      by @{author?.username || "member"}
                    </p>
                  </div>
                  <span className="text-xs uppercase tracking-[0.18em] text-muted">
                    {new Date(post.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted line-clamp-3">{post.content}</p>
              </Link>
            );
          }) : (
            <div className="card text-sm text-muted">
              No public posts are in this category yet. Once members start posting here, they will appear on this page automatically.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
