import LogoutButton from "@/components/LogoutButton";

export default function LogoutPanel() {
  return (
    <div className="card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Session</h2>
          <p className="mt-1 text-sm text-muted">Sign out from here if you are on a shared device.</p>
        </div>
        <LogoutButton />
      </div>
    </div>
  );
}
