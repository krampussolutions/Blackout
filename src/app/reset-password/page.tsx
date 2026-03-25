"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function checkSession() {
      const { data, error } = await supabase.auth.getSession();
      if (!isMounted) return;

      if (error) {
        setError(error.message);
        return;
      }

      if (!data.session) {
        setError("This reset link is missing or expired. Request a new password reset email.");
        return;
      }

      setReady(true);
    }

    checkSession();
    return () => {
      isMounted = false;
    };
  }, [supabase]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess("Password updated. Redirecting to your feed...");
    setLoading(false);
    setTimeout(() => {
      router.push("/feed");
      router.refresh();
    }, 1200);
  }

  return (
    <main className="container-shell max-w-xl py-14">
      <div className="card">
        <h1 className="text-3xl font-bold">Choose a new password</h1>
        <p className="mt-2 text-muted">Set a new password for your Blackout Network account.</p>

        {!ready && !error ? (
          <div className="mt-8 rounded-xl border border-border bg-panelSoft px-4 py-3 text-sm text-muted">
            Validating your reset link...
          </div>
        ) : null}

        {error ? (
          <div className="mt-8 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
            <div className="mt-3">
              <Link href="/forgot-password" className="text-white underline underline-offset-4">
                Request a new reset email
              </Link>
            </div>
          </div>
        ) : null}

        {ready ? (
          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-sm font-medium">New password</label>
              <input type="password" className="input" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={6} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Confirm password</label>
              <input type="password" className="input" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required minLength={6} />
            </div>

            {success ? <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">{success}</div> : null}

            <button type="submit" className="button-primary w-full" disabled={loading}>
              {loading ? "Updating..." : "Update password"}
            </button>
          </form>
        ) : null}
      </div>
    </main>
  );
}
