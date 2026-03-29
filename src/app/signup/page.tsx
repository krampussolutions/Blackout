import SignupForm from "@/components/SignupForm";

export default function SignupPage() {
  return (
    <main className="container-shell max-w-xl py-14">
      <div className="card">
        <h1 className="text-3xl font-bold">Join Blackout Network</h1>
        <p className="mt-2 text-muted">Create your account and go straight into onboarding.</p>
        <div className="mt-8">
          <SignupForm redirectTo="/onboarding" />
        </div>
      </div>
    </main>
  );
}
