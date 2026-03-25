import { groups } from "@/lib/site";

export default function GroupsPage() {
  return (
    <main className="container-shell py-12">
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Groups</h1>
          <p className="mt-2 text-muted">Topic-based spaces for outages, off-grid builds, food storage, comms, and more.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {groups.map((group) => (
            <div key={group.name} className="card">
              <h2 className="text-xl font-semibold">{group.name}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{group.description}</p>
              <button className="button-secondary mt-5">View Group</button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
