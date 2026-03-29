"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type SignupFormProps = {
  redirectTo?: string;
  compact?: boolean;
  initialInviteCode?: string;
};

export default function SignupForm({
  redirectTo = "/onboarding",
  compact = false,
  initialInviteCode = "",
}: SignupFormProps) {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const trimmedUsername = username.trim().toLowerCase();
    const trimmedDisplayName = displayName.trim();

    if (!trimmedUsername.match(/^[a-z0-9_]{3,20}$/)) {
      setError("Username must be 3-20 characters and use only lowercase letters, numbers, or underscores.");
      setLoading(false);
      return;
    }

    const emailRedirectTo = typeof window !== "undefined" ? `${window.location.origin}${redirectTo}` : undefined;
    const inviteCode = initialInviteCode.trim();

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo,
        data: {
          username: trimmedUsername,
          display_name: trimmedDisplayName || trimmedUsername,
          invite_code: inviteCode || undefined,
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    const userId = data.user?.id;
    const hasSession = Boolean(data.session);

    if (userId && hasSession) {
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: userId,
        username: trimmedUsername,
        display_name: trimmedDisplayName || trimmedUsername,
        onboarding_completed: false,
      });

      if (profileError) {
        setError(profileError.message);
        setLoading(false);
        return;
      }

      router.push(redirectTo);
      router.refresh();
      return;
    }

    setSuccess("Account created. Check your email to confirm your account, then continue onboarding.");
    setLoading(false);
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="mb-2 block text-sm font-medium">Username</label>
        <input
          type="text"
          className="input"
          placeholder="ridgewalker"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          autoComplete="username"
          required
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">Display name</label>
        <input
          type="text"
          className="input"
          placeholder="Ridge Walker"
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
          autoComplete="nickname"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">Email</label>
        <input
          type="email"
          className="input"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          required
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">Password</label>
        <input
          type="password"
          className="input"
          placeholder="Create a strong password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="new-password"
          required
          minLength={6}
        />
      </div>

      {error ? <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div> : null}
      {success ? <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">{success}</div> : null}

      <button type="submit" className="button-primary w-full" disabled={loading}>
        {loading ? "Creating account..." : "Create account"}
      </button>

      {!compact ? (
        <p className="text-sm text-muted">
          Already have an account? <Link href="/login" className="text-text underline underline-offset-4">Log in</Link>
        </p>
      ) : null}
    </form>
  );
}
