"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { categories } from "@/lib/site";

type JoinedGroup = {
  id: string;
  slug: string;
  name: string;
};

export default function NewPostPage() {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [title, setTitle] = useState("");
  const [categorySlug, setCategorySlug] = useState(categories[0]?.slug || "general-preparedness");
  const [content, setContent] = useState("");
  const [audience, setAudience] = useState<"network" | "group">("network");
  const [joinedGroups, setJoinedGroups] = useState<JoinedGroup[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadGroups() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("group_members")
        .select("group_id, groups!group_members_group_id_fkey(id, slug, name)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      const mapped = (data || [])
        .map((row) => (Array.isArray(row.groups) ? row.groups[0] : row.groups))
        .filter(Boolean)
        .map((group) => ({
          id: group!.id as string,
          slug: group!.slug as string,
          name: group!.name as string,
        }));

      setJoinedGroups(mapped);

      const params = new URLSearchParams(window.location.search);
      const presetSlug = params.get("group");
      if (presetSlug) {
        const preset = mapped.find((group) => group.slug === presetSlug);
        if (preset) {
          setAudience("group");
          setSelectedGroupId(preset.id);
        }
      }
    }

    loadGroups();
  }, [supabase]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login?redirect_to=/posts/new");
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

    if (audience === "group" && !selectedGroupId) {
      setError("Choose a group before publishing.");
      setLoading(false);
      return;
    }

    const { error: postError } = await supabase.from("posts").insert({
      user_id: user.id,
      category_id: category?.id ?? null,
      group_id: audience === "group" ? selectedGroupId : null,
      title: title.trim(),
      content: content.trim(),
    });

    if (postError) {
      setError(postError.message);
      setLoading(false);
      return;
    }

    if (audience === "group") {
      const chosenGroup = joinedGroups.find((group) => group.id === selectedGroupId);
      router.push(chosenGroup ? `/groups/${chosenGroup.slug}` : "/groups");
    } else {
      router.push("/feed");
    }
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
            <label className="mb-2 block text-sm font-medium">Post to</label>
            <div className="grid gap-3 md:grid-cols-2">
              <button
                type="button"
                onClick={() => setAudience("network")}
                className={`rounded-2xl border px-4 py-3 text-left ${audience === "network" ? "border-brand bg-brand/10 text-text" : "border-border bg-panelSoft text-muted"}`}
              >
                <div className="font-medium">Main network feed</div>
                <div className="mt-1 text-sm">Visible in the wider Blackout Network feed.</div>
              </button>
              <button
                type="button"
                onClick={() => setAudience("group")}
                className={`rounded-2xl border px-4 py-3 text-left ${audience === "group" ? "border-brand bg-brand/10 text-text" : "border-border bg-panelSoft text-muted"}`}
              >
                <div className="font-medium">A joined group</div>
                <div className="mt-1 text-sm">Keep the conversation inside a specific group.</div>
              </button>
            </div>
          </div>
          {audience === "group" ? (
            <div>
              <label className="mb-2 block text-sm font-medium">Choose group</label>
              <select className="input" value={selectedGroupId} onChange={(event) => setSelectedGroupId(event.target.value)}>
                <option value="">Select a group</option>
                {joinedGroups.map((group) => (
                  <option key={group.id} value={group.id}>{group.name}</option>
                ))}
              </select>
              {!joinedGroups.length ? <p className="mt-2 text-sm text-muted">Join a group first to post there.</p> : null}
            </div>
          ) : null}
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
