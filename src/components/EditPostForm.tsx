"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type EditPostFormProps = {
  post: {
    id: string;
    title: string;
    content: string;
    categorySlug: string;
  };
  categories: { slug: string; name: string }[];
};

export default function EditPostForm({ post, categories }: EditPostFormProps) {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [categorySlug, setCategorySlug] = useState(post.categorySlug);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

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

    const { error } = await supabase
      .from("posts")
      .update({ title: title.trim(), content: content.trim(), category_id: category?.id ?? null })
      .eq("id", post.id);

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }

    router.push(`/posts/${post.id}`);
    router.refresh();
  }

  return (
    <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="mb-2 block text-sm font-medium">Title</label>
        <input className="input" value={title} onChange={(event) => setTitle(event.target.value)} required />
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
        <textarea className="textarea" rows={8} value={content} onChange={(event) => setContent(event.target.value)} required />
      </div>
      {error ? <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div> : null}
      <button type="submit" className="button-primary" disabled={loading}>{loading ? "Saving..." : "Save changes"}</button>
    </form>
  );
}
