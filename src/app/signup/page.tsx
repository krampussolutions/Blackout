import Link from "next/link";
import SignupForm from "@/components/SignupForm";

type SignupPageProps = {
  searchParams?: Promise<{
    invite?: string;
  }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const params = (await searchParams) ?? {};
  const inviteCode = typeof params.invite === "string" ? params.invite.trim() : "";

  return (
    <main className="container-shell max-w-xl py-14">
      <div className="card">
        <h1 className="text-3xl font-bold">Join Blackout Network</h1>
        <p className="mt-2 text-muted">Create your account and start building your preparedness community.</p>
        {inviteCode ? (
          <p className="mt-3 rounded-xl border border-brand/30 bg-brand/10 px-4 py-3 text-sm text-text">
            You were invited to join Blackout Network. Create your account to accept the invite.
          </p>
        ) : null}

        <div className="mt-8">
          <SignupForm redirectTo="/onboarding" initialInviteCode={inviteCode} compact />
        </div>

        <p className="mt-6 text-sm text-muted">
          Already have an account?{" "}
          <Link href="/login" className="text-text underline underline-offset-4">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
