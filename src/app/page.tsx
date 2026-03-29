import Link from "next/link";
import { redirect } from "next/navigation";
import LoginForm from "@/components/LoginForm";
import SignupForm from "@/components/SignupForm";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const benefits = [
  "Follow members and build a preparedness network.",
  "Join topic groups for outages, food storage, water, medical, comms, and off-grid living.",
  "Get into a personalized feed after a quick onboarding step.",
];

export default async function HomePage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarding_completed")
      .eq("id", user.id)
      .maybeSingle();

    redirect(profile?.onboarding_completed ? "/feed" : "/onboarding");
  }

  return (
    <main className="container-shell py-10 md:py-14">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="card overflow-hidden">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-muted">Preparedness social network</p>
              <h1 className="mt-4 max-w-2xl text-4xl font-bold leading-tight md:text-5xl">
                Join Blackout Network and build your feed around preparedness.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
                Sign up, pick your interests, join a few groups, and then drop into a cleaner feed focused on outages,
                food storage, water, medical, comms, security, and off-grid living.
              </p>

              <div className="mt-8 grid gap-3">
                {benefits.map((benefit) => (
                  <div key={benefit} className="rounded-2xl border border-border bg-panelSoft px-4 py-4 text-sm text-muted">
                    {benefit}
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/about" className="button-secondary">Learn more</Link>
                <Link href="/community-rules" className="button-secondary">Community rules</Link>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-1">
              <div className="rounded-3xl border border-border bg-panelSoft/70 p-5">
                <h2 className="text-2xl font-semibold">Create account</h2>
                <p className="mt-2 text-sm text-muted">New members go from signup to onboarding, then straight to the feed.</p>
                <div className="mt-6">
                  <SignupForm redirectTo="/onboarding" compact />
                </div>
              </div>

              <div className="rounded-3xl border border-border bg-panelSoft/70 p-5">
                <h2 className="text-2xl font-semibold">Already a member?</h2>
                <p className="mt-2 text-sm text-muted">Log in and we will send you to your onboarding or feed automatically.</p>
                <div className="mt-6">
                  <LoginForm redirectTo="/feed" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
