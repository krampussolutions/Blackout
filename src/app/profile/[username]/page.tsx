import { notFound } from "next/navigation";
import PostCard from "@/components/PostCard";
import ProfileHeader from "@/components/ProfileHeader";
import { getMemberProfile, samplePosts } from "@/lib/site";

type ProfilePageProps = {
  params: Promise<{ username: string }>;
};

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;
  const profile = getMemberProfile(username);

  if (!profile) {
    notFound();
  }

  const posts = samplePosts.filter((post) => post.author === username);

  return (
    <main className="container-shell py-10">
      <div className="space-y-6">
        <ProfileHeader profile={profile} />

        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="space-y-4">
            <div className="card">
              <h2 className="text-lg font-semibold">About</h2>
              <p className="mt-3 text-sm leading-6 text-muted">{profile.bio}</p>
              <div className="mt-4 text-sm text-muted">{profile.location}</div>
              <div className="mt-2 text-sm text-muted">{profile.joinedLabel}</div>
            </div>

            <div className="card">
              <h2 className="text-lg font-semibold">Following</h2>
              <p className="mt-3 text-sm leading-6 text-muted">
                This member follows {profile.following} people and is followed by {profile.followers} members.
              </p>
            </div>
          </aside>

          <section className="space-y-4">
            <div className="card">
              <h2 className="text-lg font-semibold">Posts</h2>
              <p className="mt-2 text-sm text-muted">Recent activity from {profile.displayName}.</p>
            </div>

            {posts.length ? posts.map((post) => <PostCard key={post.id} {...post} />) : (
              <div className="card text-sm text-muted">No posts yet.</div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
