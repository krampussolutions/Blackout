import { redirect } from "next/navigation";
import OnboardingForm from "@/components/OnboardingForm";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function OnboardingPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect_to=/onboarding");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, display_name, bio, location, interests, onboarding_completed")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    redirect("/feed");
  }

  if (profile.onboarding_completed) {
    redirect("/feed");
  }

  return (
    <main className="container-shell py-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="card">
          <p className="text-xs uppercase tracking-[0.22em] text-muted">Welcome to Blackout Network</p>
          <h1 className="mt-3 text-3xl font-bold">Set up your account before you hit the feed</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
            Pick your interests, join a few starter groups, and give people a little context about what you are preparing for.
          </p>
        </div>

        <div className="card">
          <OnboardingForm profile={profile} />
        </div>
      </div>
    </main>
  );
}
