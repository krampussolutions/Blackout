"use client";

import { useMemo, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { NotificationPreferences } from "@/lib/notifications/types";

const rows = [
  { label: "Likes", email: "email_like", push: "push_like" },
  { label: "Comments", email: "email_comment", push: "push_comment" },
  { label: "Follows", email: "email_follow", push: "push_follow" },
  { label: "Group joins", email: "email_group_join", push: "push_group_join" },
  { label: "Direct messages", email: "email_message", push: "push_message" },
  { label: "Accepted invites", email: "email_invite_accepted", push: "push_invite_accepted" },
  { label: "System alerts", email: "email_system", push: "push_system" },
] as const;

type Props = {
  initialPreferences: NotificationPreferences;
};

export default function NotificationPreferencesForm({ initialPreferences }: Props) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [preferences, setPreferences] = useState<NotificationPreferences>(initialPreferences);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updatePreference(key: keyof NotificationPreferences, value: boolean) {
    setPreferences((current) => ({ ...current, [key]: value }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    setError(null);

    const { error: upsertError } = await supabase.from("notification_preferences").upsert(preferences, { onConflict: "user_id" });

    if (upsertError) {
      setError(upsertError.message);
      setSaving(false);
      return;
    }

    setSaved(true);
    setSaving(false);
  }

  return (
    <div className="card space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-text">Notification channels</h2>
        <p className="mt-2 text-sm text-muted">Choose which events send email and browser push alerts. In-app notifications always stay available on your notifications page.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="rounded-2xl border border-border bg-panelSoft p-4 text-sm text-text">
          <div className="flex items-center justify-between gap-3">
            <span className="font-medium">Enable email notifications</span>
            <input type="checkbox" checked={preferences.email_enabled} onChange={(event) => updatePreference("email_enabled", event.target.checked)} />
          </div>
        </label>
        <label className="rounded-2xl border border-border bg-panelSoft p-4 text-sm text-text">
          <div className="flex items-center justify-between gap-3">
            <span className="font-medium">Enable browser push</span>
            <input type="checkbox" checked={preferences.push_enabled} onChange={(event) => updatePreference("push_enabled", event.target.checked)} />
          </div>
        </label>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-panelSoft text-left text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Event</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Browser push</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-panel">
            {rows.map((row) => (
              <tr key={row.label}>
                <td className="px-4 py-3 text-text">{row.label}</td>
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={Boolean(preferences[row.email])}
                    onChange={(event) => updatePreference(row.email as keyof NotificationPreferences, event.target.checked)}
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={Boolean(preferences[row.push])}
                    onChange={(event) => updatePreference(row.push as keyof NotificationPreferences, event.target.checked)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {error ? <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div> : null}
      {saved ? <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">Preferences saved.</div> : null}

      <div className="flex justify-end">
        <button type="button" className="button-primary" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save preferences"}
        </button>
      </div>
    </div>
  );
}
