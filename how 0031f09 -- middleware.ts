[33mcommit 0031f0904fb0c0ec92246b00dc1b2a5061aad84e[m[33m ([m[1;36mHEAD[m[33m -> [m[1;32mmain[m[33m, [m[1;31morigin/main[m[33m)[m
Author: Matthew Poteet <krampussolutions@gmail.com>
Date:   Thu Mar 26 21:14:54 2026 -0400

    patch cat.

[1mdiff --git a/src/app/categories/[slug]/page.tsx b/src/app/categories/[slug]/page.tsx[m
[1mnew file mode 100644[m
[1mindex 0000000..fe3b067[m
[1m--- /dev/null[m
[1m+++ b/src/app/categories/[slug]/page.tsx[m
[36m@@ -0,0 +1,122 @@[m
[32m+[m[32mimport type { Metadata } from "next";[m
[32m+[m[32mimport Link from "next/link";[m
[32m+[m[32mimport { redirect, notFound } from "next/navigation";[m
[32m+[m[32mimport { normalizeCategorySlug } from "@/lib/category-aliases";[m
[32m+[m[32mimport { createSupabaseServerClient } from "@/lib/supabase/server";[m
[32m+[m[32mimport { siteConfig } from "@/lib/site";[m
[32m+[m
[32m+[m[32masync function getCategoryData(rawSlug: string) {[m
[32m+[m[32m  const supabase = await createSupabaseServerClient();[m
[32m+[m[32m  const normalizedSlug = normalizeCategorySlug(rawSlug);[m
[32m+[m
[32m+[m[32m  const { data: category } = await supabase[m
[32m+[m[32m    .from("categories")[m
[32m+[m[32m    .select("id, name, slug, description")[m
[32m+[m[32m    .eq("slug", normalizedSlug)[m
[32m+[m[32m    .maybeSingle();[m
[32m+[m
[32m+[m[32m  return { supabase, normalizedSlug, category };[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32mexport async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {[m
[32m+[m[32m  const { slug } = await params;[m
[32m+[m[32m  const { category, normalizedSlug } = await getCategoryData(slug);[m
[32m+[m
[32m+[m[32m  if (!category) {[m
[32m+[m[32m    return {[m
[32m+[m[32m      title: `${siteConfig.name} | Preparedness Community`,[m
[32m+[m[32m      description: siteConfig.description,[m
[32m+[m[32m    };[m
[32m+[m[32m  }[m
[32m+[m
[32m+[m[32m  const canonicalUrl = `${siteConfig.url.replace(/\/$/, "")}/categories/${normalizedSlug}`;[m
[32m+[m[32m  const description = category.description || `Preparedness posts and resources for ${category.name}.`;[m
[32m+[m
[32m+[m[32m  return {[m
[32m+[m[32m    title: `${category.name} | ${siteConfig.name}`,[m
[32m+[m[32m    description,[m
[32m+[m[32m    alternates: {[m
[32m+[m[32m      canonical: canonicalUrl,[m
[32m+[m[32m    },[m
[32m+[m[32m    openGraph: {[m
[32m+[m[32m      title: `${category.name} | ${siteConfig.name}`,[m
[32m+[m[32m      description,[m
[32m+[m[32m      url: canonicalUrl,[m
[32m+[m[32m      siteName: siteConfig.name,[m
[32m+[m[32m      type: "website",[m
[32m+[m[32m    },[m
[32m+[m[32m  };[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32mexport default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {[m
[32m+[m[32m  const { slug } = await params;[m
[32m+[m[32m  const { supabase, normalizedSlug, category } = await getCategoryData(slug);[m
[32m+[m
[32m+[m[32m  if (slug !== normalizedSlug) {[m
[32m+[m[32m    redirect(`/categories/${normalizedSlug}`);[m
[32m+[m[32m  }[m
[32m+[m
[32m+[m[32m  if (!category) {[m
[32m+[m[32m    notFound();[m
[32m+[m[32m  }[m
[32m+[m
[32m+[m[32m  const [{ data: posts }, { count: postCount }] = await Promise.all([[m
[32m+[m[32m    supabase[m
[32m+[m[32m      .from("posts")[m
[32m+[m[32m      .select([m
[32m+[m[32m        "id, title, content, created_at, profiles!posts_user_id_fkey(username, display_name)",[m
[32m+[m[32m      )[m
[32m+[m[32m      .eq("category_id", category.id)[m
[32m+[m[32m      .order("created_at", { ascending: false })[m
[32m+[m[32m      .limit(8),[m
[32m+[m[32m    supabase[m
[32m+[m[32m      .from("posts")[m
[32m+[m[32m      .select("id", { count: "exact", head: true })[m
[32m+[m[32m      .eq("category_id", category.id),[m
[32m+[m[32m  ]);[m
[32m+[m
[32m+[m[32m  return ([m
[32m+[m[32m    <main className="container-shell py-12">[m
[32m+[m[32m      <div className="mx-auto max-w-5xl space-y-6">[m
[32m+[m[32m        <div className="card">[m
[32m+[m[32m          <p className="text-xs uppercase tracking-[0.18em] text-muted">Preparedness category</p>[m
[32m+[m[32m          <h1 className="mt-3 text-3xl font-bold">{category.name}</h1>[m
[32m+[m[32m          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">[m
[32m+[m[32m            {category.description || `Browse posts and preparedness discussions related to ${category.name}.`}[m
[32m+[m[32m          </p>[m
[32m+[m[32m          <div className="mt-5 flex flex-wrap gap-3">[m
[32m+[m[32m            <Link href={`/feed?category=${category.slug}`} className="button-primary">Open in feed</Link>[m
[32m+[m[32m            <Link href="/guides" className="button-secondary">Browse public guides</Link>[m
[32m+[m[32m          </div>[m
[32m+[m[32m          <p className="mt-4 text-xs uppercase tracking-[0.18em] text-muted">{postCount || 0} public posts</p>[m
[32m+[m[32m        </div>[m
[32m+[m
[32m+[m[32m        <div className="grid gap-4">[m
[32m+[m[32m          {posts?.length ? posts.map((post) => {[m
[32m+[m[32m            const author = Array.isArray(post.profiles) ? post.profiles[0] : post.profiles;[m
[32m+[m[32m            return ([m
[32m+[m[32m              <Link key={post.id} href={`/posts/${post.id}`} className="card block transition hover:border-brand/40">[m
[32m+[m[32m                <div className="flex flex-wrap items-center justify-between gap-3">[m
[32m+[m[32m                  <div>[m
[32m+[m[32m                    <h2 className="text-xl font-semibold">{post.title}</h2>[m
[32m+[m[32m                    <p className="mt-2 text-sm text-muted">[m
[32m+[m[32m                      by @{author?.username || "member"}[m
[32m+[m[32m                    </p>[m
[32m+[m[32m                  </div>[m
[32m+[m[32m                  <span className="text-xs uppercase tracking-[0.18em] text-muted">[m
[32m+[m[32m                    {new Date(post.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}[m
[32m+[m[32m                  </span>[m
[32m+[m[32m                </div>[m
[32m+[m[32m                <p className="mt-3 text-sm leading-6 text-muted line-clamp-3">{post.content}</p>[m
[32m+[m[32m              </Link>[m
[32m+[m[32m            );[m
[32m+[m[32m          }) : ([m
[32m+[m[32m            <div className="card text-sm text-muted">[m
[32m+[m[32m              No public posts are in this category yet. Once members start posting here, they will appear on this page automatically.[m
[32m+[m[32m            </div>[m
[32m+[m[32m          )}[m
[32m+[m[32m        </div>[m
[32m+[m[32m      </div>[m
[32m+[m[32m    </main>[m
[32m+[m[32m  );[m
[32m+[m[32m}[m
