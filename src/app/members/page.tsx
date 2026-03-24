import Link from "next/link";
import MemberCard from "@/components/MemberCard";
import { memberProfiles } from "@/lib/site";

export default function MembersPage() {
  return (
    <main className="container-shell py-10">
      <div className="space-y-6">
        <div className="card">
          <h1 className="text-3xl font-bold">Members</h1>
          <p className="mt-2 text-sm text-muted">
            Browse preparedness-minded members, visit their profiles, and build your network.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {memberProfiles.map((member) => (
            <div key={member.username} className="card space-y-4">
              <MemberCard member={member} />
              <Link href={`/profile/${member.username}`} className="block rounded-xl border border-border bg-panelSoft px-4 py-3 text-center text-sm text-text transition hover:bg-black/20">
                View profile
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
