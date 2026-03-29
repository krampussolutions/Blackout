"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const interestOptions = [
  "General Preparedness",
  "Power Outages",
  "Water & Filtration",
  "Food Storage",
  "Medical",
  "Comms",
  "Off Grid Living",
  "Homesteading",
  "Security",
];

const starterGroups = [
  { slug: "power-outages", label: "Power Outages" },
  { slug: "off-grid-living", label: "Off Grid Living" },
  { slug: "food-storage", label: "Food Storage" },
  { slug: "water-filtration", label: "Water & Filtration" },
  { slug: "medical-first-aid", label: "Medical / First Aid" },
  { slug: "comms-group", label: "Comms" },
  { slug: "homesteading", label: "Homesteading" },
  { slug: "security", label: "Security" },
];

type OnboardingFormProps = {
  profile: {
    id: string;
    username: string;
    display_name?: string | null;
    bio?: string | null;
    location?: string | null;
    interests?: string[] | null;
  };
};

export default function OnboardingForm({ profile }: OnboardingFormProps) {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const [displayName, setDisplayName] = useState(profile.display_name || "");
  const [location, setLocation] = useState(profile.location || "");
  const [bio, setBio] = useState(profile.bio || "");
  const [interests, setInterests] = useState<string[]>(profile.interests || []);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleValue(value: string, state: string[], setter: (values: string[]) => void) {
    setter(state.includes(value) ? state.filter((item) => item !== value) : [...state, value]);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!interests.length) {
      setError("Choose at least one interest so we can tailor your feed.");
      setLoading(false);
      return;
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        display_name: displayName.trim() || profile.username,
        location: location.trim() || null,
        bio: bio.trim() || null,
        interests,
        onboarding_completed: true,
      })
      .eq("id", profile.id);

    if (profileError) {
      setError(profileError.message);
      setLoading(false);
      return;
    }

    if (selectedGroups.length) {
      const { data: groups, error: groupsError } = await supabase
        .from("groups")
        .select("id, slug")
        .in("slug", selectedGroups);

      if (groupsError) {
        setError(groupsError.message);
        setLoading(false);
        return;
      }

      if (groups?.length) {
        const membershipRows = groups.map((group) => ({
          group_id: group.id,
          user_id: profile.id,
        }));

        const { error: membershipError } = await supabase
          .from("group_members")
          .upsert(membershipRows, { onConflict: "group_id,user_id", ignoreDuplicates: true });

        if (membershipError) {
          setError(membershipError.message);
          setLoading(false);
          return;
        }
      }
    }

    router.push("/feed");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">Display name</label>
          <input className="input" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Location</label>
          <input className="input" placeholder="Robbinsville, NC" value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Short bio</label>
        <textarea className="input min-h-28" placeholder="Tell people what you are focused on: outage prep, food storage, radios, off-grid, homesteading..." value={bio} onChange={(e) => setBio(e.target.value)} />
      </div>

      <div>
        <label className="mb-3 block text-sm font-medium">Pick your interests</label>
        <div className="flex flex-wrap gap-2">
          {interestOptions.map((option) => {
            const active = interests.includes(option);
            return (
              <button
                key={option}
                type="button"
                onClick={() => toggleValue(option, interests, setInterests)}
                className={`rounded-full border px-3 py-2 text-sm transition ${active ? "border-brand bg-brand/20 text-brand" : "border-border bg-panelSoft text-muted hover:border-brand/40 hover:text-text"}`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="mb-3 block text-sm font-medium">Starter groups</label>
        <div className="grid gap-3 md:grid-cols-2">
          {starterGroups.map((group) => {
            const active = selectedGroups.includes(group.slug);
            return (
              <button
                key={group.slug}
                type="button"
                onClick={() => toggleValue(group.slug, selectedGroups, setSelectedGroups)}
                className={`rounded-2xl border px-4 py-4 text-left transition ${active ? "border-brand bg-brand/10" : "border-border bg-panelSoft hover:border-brand/40"}`}
              >
                <div className="font-medium text-text">{group.label}</div>
                <div className="mt-1 text-sm text-muted">Join this group now</div>
              </button>
            );
          })}
        </div>
      </div>

      {error ? <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div> : null}

      <div className="flex flex-wrap gap-3">
        <button type="submit" className="button-primary" disabled={loading}>
          {loading ? "Saving..." : "Finish onboarding"}
        </button>
        <button
          type="button"
          className="button-secondary"
          disabled={loading}
          onClick={async () => {
            setLoading(true);
            setError(null);
            const { error: skipError } = await supabase
              .from("profiles")
              .update({ onboarding_completed: true })
              .eq("id", profile.id);
            if (skipError) {
              setError(skipError.message);
              setLoading(false);
              return;
            }
            router.push("/feed");
            router.refresh();
          }}
        >
          Skip for now
        </button>
      </div>
    </form>
  );
}
