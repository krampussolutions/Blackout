import { notFound, redirect } from "next/navigation";
import EditPostForm from "@/components/EditPostForm";
import { categories } from "@/lib/site";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=/posts/${id}/edit`);
  }

  const { data: post } = await supabase
    .from("posts")
    .select("id, title, content, user_id, categories(slug)")
    .eq("id", id)
    .maybeSingle();

  if (!post) notFound();
  if (post.user_id !== user.id) redirect(`/posts/${id}`);

  const category = Array.isArray(post.categories) ? post.categories[0] : post.categories;

  return (
    <main className="container-shell max-w-3xl py-14">
      <div className="card">
        <h1 className="text-3xl font-bold">Edit post</h1>
        <p className="mt-2 text-muted">Update your post and save your changes.</p>
        <EditPostForm
          post={{
            id: post.id,
            title: post.title,
            content: post.content,
            categorySlug: category?.slug || categories[0]?.slug || "general-preparedness",
          }}
          categories={categories.map((category) => ({ slug: category.slug, name: category.name }))}
        />
      </div>
    </main>
  );
}
