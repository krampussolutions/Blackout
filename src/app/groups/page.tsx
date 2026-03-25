import Link from "next/link";
import GroupJoinButton from "@/components/GroupJoinButton";
import { groups as fallbackGroups } from "@/lib/site";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type DbGroup = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_by?: string | null;
};

export default async function GroupsPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: dbGroups }, { data: memberships }] = await Promise.all([
    supabase.from("groups").select("id, name, slug, description, created_by").order("name"),
    user
      ? supabase.from("group_members").select("group_id").eq("user_id", user.id)
      : Promise.resolve({ data: [] as { group_id: string }[] }),
  ]);

  const joinedGroupIds = new Set((memberships || []).map((row) => row.group_id));
  const groups = dbGroups && dbGroups.length > 0 ? (dbGroups as DbGroup[]) : fallbackGroups.map((group, index) => ({
    id: `sample-${index}`,
    name: group.name,
    slug: group.slug,
    description: group.description,
  }));

  const memberCounts = new Map<string, number>();
  await Promise.all(
    groups.map(async (group) => {
      if (group.id.startsWith("sample-")) {
        memberCounts.set(group.id, 0);
        return;
      }
      const { count } = await supabase
        .from("group_members")
        .select("id", { count: "exact", head: true })
        .eq("group_id", group.id);
      memberCounts.set(group.id, count || 0);
    })
  );

  return (
    <main className="container-shell py-12">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Groups</h1>
            <p className="mt-2 text-muted">
              Topic-based spaces for outages, off-grid builds, food storage, comms, and more.
            </p>
          </div>
          <Link href="/posts/new" className="button-primary">Create Post</Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {groups.map((group) => (
            <div key={group.slug} className="card flex flex-col">
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold">{group.name}</h2>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted">
                      {memberCounts.get(group.id) || 0} members
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted">{group.description || "Preparedness group"}</p>
              </div>
              <div className="mt-5 flex items-center gap-3">
                <Link href={`/groups/${group.slug}`} className="button-secondary">View Group</Link>
                {!group.id.startsWith("sample-") ? (
                  <GroupJoinButton
                    groupId={group.id}
                    groupSlug={group.slug}
                    initialIsMember={joinedGroupIds.has(group.id)}
                  />
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
