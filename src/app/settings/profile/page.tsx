import { redirect } from "next/navigation";
import EditProfileForm from "@/components/EditProfileForm";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function EditProfilePage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/settings/profile");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, display_name, bio, location, avatar_url, cover_url, interests")
    .eq("id", user.id)
    .single();

  if (!profile) {
    redirect("/feed");
  }

  return (
    <main className="container-shell max-w-3xl py-12">
      <div className="card">
        <h1 className="text-3xl font-bold">Edit profile</h1>
        <p className="mt-2 text-muted">Update your public profile, upload an avatar, and refresh your cover image.</p>
        <div className="mt-8">
          <EditProfileForm profile={profile} />
        </div>
      </div>
    </main>
  );
}
