"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { categories } from "@/lib/site";

export default function NewPostPage() {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [title, setTitle] = useState("");
  const [categorySlug, setCategorySlug] = useState(categories[0]?.slug || "general-preparedness");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login?next=/posts/new");
      return;
    }

    const { data: category, error: categoryError } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", categorySlug)
      .maybeSingle();

    if (categoryError) {
      setError(categoryError.message);
      setLoading(false);
      return;
    }

    const { error: postError } = await supabase.from("posts").insert({
      user_id: user.id,
      category_id: category?.id ?? null,
      title: title.trim(),
      content: content.trim(),
    });

    if (postError) {
      setError(postError.message);
      setLoading(false);
      return;
    }

    router.push("/feed");
    router.refresh();
  }

  return (
    <main className="container-shell max-w-3xl py-14">
      <div className="card">
        <h1 className="text-3xl font-bold">Create a new post</h1>
        <p className="mt-2 text-muted">Share a tip, ask a question, or post a field-tested setup.</p>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium">Title</label>
            <input
              type="text"
              className="input"
              placeholder="What is your best freezer backup plan during an outage?"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Category</label>
            <select className="input" value={categorySlug} onChange={(event) => setCategorySlug(event.target.value)}>
              {categories.map((category) => (
                <option key={category.slug} value={category.slug}>{category.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Content</label>
            <textarea
              className="textarea"
              placeholder="Share your setup, question, or preparedness strategy..."
              value={content}
              onChange={(event) => setContent(event.target.value)}
              required
            />
          </div>
          {error ? <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div> : null}
          <button type="submit" className="button-primary" disabled={loading}>
            {loading ? "Publishing..." : "Publish post"}
          </button>
        </form>
      </div>
    </main>
  );
}
