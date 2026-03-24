export default function LoginPage() {
  return (
    <main className="container-shell max-w-xl py-14">
      <div className="card">
        <h1 className="text-3xl font-bold">Login</h1>
        <p className="mt-2 text-muted">Access your preparedness network account.</p>
        <form className="mt-8 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Email</label>
            <input type="email" className="input" placeholder="you@example.com" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Password</label>
            <input type="password" className="input" placeholder="••••••••" />
          </div>
          <button type="submit" className="button-primary w-full">Login</button>
        </form>
      </div>
    </main>
  );
}
