import LoginForm from "@/components/LoginForm";

type LoginPageProps = {
  searchParams?: Promise<{
    redirect_to?: string;
    message?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = (await searchParams) ?? {};
  const redirectTo = params.redirect_to || "/onboarding";
  const message = params.message || "";

  return (
    <main className="container-shell py-10">
      <div className="mx-auto max-w-md">
        <div className="card mb-4">
          <h1 className="text-2xl font-semibold">Log in</h1>
          <p className="mt-2 text-sm text-muted">
            Access your Blackout Network account.
          </p>
          {message ? (
            <p className="mt-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
              {message}
            </p>
          ) : null}
        </div>

        <LoginForm redirectTo={redirectTo} />
      </div>
    </main>
  );
}