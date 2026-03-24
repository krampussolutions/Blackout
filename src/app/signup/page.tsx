export default function SignupPage() {
  return (
    <main className="container-shell max-w-xl py-14">
      <div className="card">
        <h1 className="text-3xl font-bold">Join Blackout Network</h1>
        <p className="mt-2 text-muted">Create your account and start building your preparedness community.</p>
        <form className="mt-8 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Username</label>
            <input type="text" className="input" placeholder="ridgewalker" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Email</label>
            <input type="email" className="input" placeholder="you@example.com" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Password</label>
            <input type="password" className="input" placeholder="Create a strong password" />
          </div>
          <button type="submit" className="button-primary w-full">Create account</button>
        </form>
      </div>
    </main>
  );
}
