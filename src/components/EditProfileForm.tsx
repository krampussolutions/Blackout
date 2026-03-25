"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type EditProfileFormProps = {
  profile: {
    id: string;
    username: string;
    display_name: string | null;
    bio: string | null;
    location: string | null;
    avatar_url: string | null;
    cover_url: string | null;
    interests: string[] | null;
  };
};

export default function EditProfileForm({ profile }: EditProfileFormProps) {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [displayName, setDisplayName] = useState(profile.display_name || "");
  const [bio, setBio] = useState(profile.bio || "");
  const [location, setLocation] = useState(profile.location || "");
  const [interests, setInterests] = useState((profile.interests || []).join(", "));
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || "");
  const [coverUrl, setCoverUrl] = useState(profile.cover_url || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function uploadFile(bucket: "avatars" | "covers", file: File) {
    const extension = file.name.split(".").pop() || "jpg";
    const path = `${profile.id}/${Date.now()}.${extension}`;
    const { error } = await supabase.storage.from(bucket).upload(path, file, {
      upsert: true,
      contentType: file.type || undefined,
    });

    if (error) throw error;

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      let nextAvatarUrl = avatarUrl || null;
      let nextCoverUrl = coverUrl || null;

      if (avatarFile) {
        nextAvatarUrl = await uploadFile("avatars", avatarFile);
      }

      if (coverFile) {
        nextCoverUrl = await uploadFile("covers", coverFile);
      }

      const cleanInterests = interests
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean)
        .slice(0, 8);

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          display_name: displayName.trim() || profile.username,
          bio: bio.trim(),
          location: location.trim(),
          interests: cleanInterests,
          avatar_url: nextAvatarUrl,
          cover_url: nextCoverUrl,
        })
        .eq("id", profile.id);

      if (updateError) throw updateError;

      setSuccess("Profile updated.");
      router.push(`/profile/${profile.username}`);
      router.refresh();
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Unable to update profile.";
      setError(message);
    }

    setLoading(false);
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">Display name</label>
          <input className="input" value={displayName} onChange={(event) => setDisplayName(event.target.value)} />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Location</label>
          <input className="input" value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Western North Carolina" />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Bio</label>
        <textarea className="textarea" value={bio} onChange={(event) => setBio(event.target.value)} placeholder="Tell people what you prep for and what you post about." />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Interests</label>
        <input className="input" value={interests} onChange={(event) => setInterests(event.target.value)} placeholder="Backup Power, Water, Medical" />
        <p className="mt-2 text-xs text-muted">Separate interests with commas.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="card border border-border bg-panelSoft p-4">
          <label className="mb-2 block text-sm font-medium">Avatar image</label>
          <input type="file" accept="image/*" onChange={(event) => setAvatarFile(event.target.files?.[0] || null)} className="block w-full text-sm text-muted" />
          {avatarUrl ? <p className="mt-2 break-all text-xs text-muted">Current: {avatarUrl}</p> : null}
        </div>
        <div className="card border border-border bg-panelSoft p-4">
          <label className="mb-2 block text-sm font-medium">Cover image</label>
          <input type="file" accept="image/*" onChange={(event) => setCoverFile(event.target.files?.[0] || null)} className="block w-full text-sm text-muted" />
          {coverUrl ? <p className="mt-2 break-all text-xs text-muted">Current: {coverUrl}</p> : null}
        </div>
      </div>

      {error ? <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div> : null}
      {success ? <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">{success}</div> : null}

      <button type="submit" className="button-primary" disabled={loading}>
        {loading ? "Saving..." : "Save profile"}
      </button>
    </form>
  );
}
