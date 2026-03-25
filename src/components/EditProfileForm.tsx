\
"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useState } from "react";
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

const MAX_BIO = 280;
const MAX_FILE_MB = 5;

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
  const [avatarPreview, setAvatarPreview] = useState(profile.avatar_url || "");
  const [coverPreview, setCoverPreview] = useState(profile.cover_url || "");
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const [removeCover, setRemoveCover] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (avatarPreview && avatarPreview.startsWith("blob:")) URL.revokeObjectURL(avatarPreview);
      if (coverPreview && coverPreview.startsWith("blob:")) URL.revokeObjectURL(coverPreview);
    };
  }, [avatarPreview, coverPreview]);

  function validateImage(file: File, label: string) {
    if (!file.type.startsWith("image/")) {
      throw new Error(`${label} must be an image file.`);
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      throw new Error(`${label} must be smaller than ${MAX_FILE_MB} MB.`);
    }
  }

  function onAvatarChange(file: File | null) {
    if (!file) return;
    validateImage(file, "Avatar");
    if (avatarPreview && avatarPreview.startsWith("blob:")) URL.revokeObjectURL(avatarPreview);
    setAvatarFile(file);
    setRemoveAvatar(false);
    setAvatarPreview(URL.createObjectURL(file));
  }

  function onCoverChange(file: File | null) {
    if (!file) return;
    validateImage(file, "Cover image");
    if (coverPreview && coverPreview.startsWith("blob:")) URL.revokeObjectURL(coverPreview);
    setCoverFile(file);
    setRemoveCover(false);
    setCoverPreview(URL.createObjectURL(file));
  }

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
      let nextAvatarUrl = removeAvatar ? null : avatarUrl || null;
      let nextCoverUrl = removeCover ? null : coverUrl || null;

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
          bio: bio.trim().slice(0, MAX_BIO),
          location: location.trim(),
          interests: cleanInterests,
          avatar_url: nextAvatarUrl,
          cover_url: nextCoverUrl,
        })
        .eq("id", profile.id);

      if (updateError) throw updateError;

      setSuccess("Profile updated.");
      router.refresh();
      router.push(`/profile/${profile.username}`);
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Unable to update profile.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  const interestTags = interests
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
    .slice(0, 8);

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <section className="space-y-4">
        <div className="rounded-3xl border border-border bg-panelSoft p-4">
          <div className="relative h-44 overflow-hidden rounded-2xl border border-border bg-gradient-to-r from-slate-700 via-slate-800 to-zinc-950">
            {coverPreview ? (
              <Image src={coverPreview} alt="Cover preview" fill className="object-cover" unoptimized />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted">
                No cover selected
              </div>
            )}
          </div>

          <div className="-mt-12 flex flex-col gap-4 px-2 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="relative h-24 w-24 overflow-hidden rounded-3xl border-4 border-panel bg-panel text-center text-2xl font-bold leading-[88px] text-text">
                {avatarPreview ? (
                  <Image src={avatarPreview} alt="Avatar preview" fill className="object-cover" unoptimized />
                ) : (
                  (displayName || profile.username).slice(0, 2).toUpperCase()
                )}
              </div>
              <div>
                <p className="text-lg font-semibold text-text">{displayName || profile.username}</p>
                <p className="text-sm text-muted">@{profile.username}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <label className="button-secondary cursor-pointer">
                Upload avatar
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => {
                    try {
                      onAvatarChange(event.target.files?.[0] || null);
                    } catch (caught) {
                      setError(caught instanceof Error ? caught.message : "Invalid avatar.");
                    }
                  }}
                />
              </label>
              <label className="button-secondary cursor-pointer">
                Upload cover
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => {
                    try {
                      onCoverChange(event.target.files?.[0] || null);
                    } catch (caught) {
                      setError(caught instanceof Error ? caught.message : "Invalid cover image.");
                    }
                  }}
                />
              </label>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted">
            <button
              type="button"
              className="rounded-lg border border-border px-3 py-1.5 hover:text-text"
              onClick={() => {
                setAvatarFile(null);
                setAvatarPreview("");
                setAvatarUrl("");
                setRemoveAvatar(true);
              }}
            >
              Remove avatar
            </button>
            <button
              type="button"
              className="rounded-lg border border-border px-3 py-1.5 hover:text-text"
              onClick={() => {
                setCoverFile(null);
                setCoverPreview("");
                setCoverUrl("");
                setRemoveCover(true);
              }}
            >
              Remove cover
            </button>
            <span className="self-center">JPG, PNG, WEBP up to {MAX_FILE_MB} MB.</span>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="card">
          <label className="mb-2 block text-sm font-medium">Display name</label>
          <input
            className="input"
            value={displayName}
            maxLength={40}
            onChange={(event) => setDisplayName(event.target.value)}
            placeholder="How people see your name"
          />
        </div>
        <div className="card">
          <label className="mb-2 block text-sm font-medium">Username</label>
          <input className="input opacity-70" value={profile.username} disabled />
          <p className="mt-2 text-xs text-muted">Usernames are fixed for now.</p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="card">
          <label className="mb-2 block text-sm font-medium">Location</label>
          <input
            className="input"
            value={location}
            maxLength={60}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="Western North Carolina"
          />
        </div>
        <div className="card">
          <label className="mb-2 block text-sm font-medium">Interests</label>
          <input
            className="input"
            value={interests}
            onChange={(event) => setInterests(event.target.value)}
            placeholder="Backup Power, Water, Medical"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {interestTags.length ? interestTags.map((tag) => (
              <span key={tag} className="rounded-full border border-border bg-panelSoft px-2.5 py-1 text-xs text-muted">
                {tag}
              </span>
            )) : (
              <span className="text-xs text-muted">Separate interests with commas. Up to 8 tags.</span>
            )}
          </div>
        </div>
      </section>

      <section className="card">
        <div className="mb-2 flex items-center justify-between gap-3">
          <label className="block text-sm font-medium">Bio</label>
          <span className="text-xs text-muted">{bio.length}/{MAX_BIO}</span>
        </div>
        <textarea
          className="textarea"
          value={bio}
          maxLength={MAX_BIO}
          onChange={(event) => setBio(event.target.value)}
          placeholder="Tell people what you prep for, what you post about, and what kind of members you want to connect with."
        />
      </section>

      {error ? <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div> : null}
      {success ? <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">{success}</div> : null}

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className="button-primary" disabled={loading}>
          {loading ? "Saving..." : "Save profile"}
        </button>
        <button
          type="button"
          className="button-secondary"
          onClick={() => router.push(`/profile/${profile.username}`)}
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
