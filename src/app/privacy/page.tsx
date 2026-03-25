import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Blackout Network",
  description: "Privacy Policy for Blackout Network, including data use, cookies, and advertising disclosures.",
};

export default function PrivacyPage() {
  return (
    <main className="container-shell py-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="card">
          <h1 className="text-3xl font-semibold">Privacy Policy</h1>
          <p className="mt-4 text-sm leading-7 text-muted">
            Blackout Network collects the information needed to provide user accounts,
            profiles, posts, comments, community moderation, and site performance.
            By using the site, you agree to this policy.
          </p>
        </div>

        <section className="card">
          <h2 className="text-xl font-semibold">Information we collect</h2>
          <ul className="mt-4 space-y-2 text-sm leading-7 text-muted">
            <li>Account information such as email address and login credentials</li>
            <li>Profile information such as username, bio, location, avatar, and cover image</li>
            <li>Content you create, including posts, comments, likes, follows, and reports</li>
            <li>Basic usage, diagnostic, and security information needed to operate the platform</li>
          </ul>
        </section>

        <section className="card">
          <h2 className="text-xl font-semibold">How information is used</h2>
          <ul className="mt-4 space-y-2 text-sm leading-7 text-muted">
            <li>To create and maintain your account</li>
            <li>To display your public profile and community activity</li>
            <li>To secure the platform and investigate abuse, spam, or rule violations</li>
            <li>To improve site performance and user experience</li>
          </ul>
        </section>

        <section className="card">
          <h2 className="text-xl font-semibold">Advertising, cookies, and third parties</h2>
          <p className="mt-4 text-sm leading-7 text-muted">
            Blackout Network uses advertising technologies, including Google AdSense and
            related services, to display ads. Third-party vendors may use cookies to serve
            ads based on prior visits to this site or other websites. Users can learn more
            about how Google uses information in advertising and can manage ad settings
            through Google&apos;s services.
          </p>
          <p className="mt-4 text-sm leading-7 text-muted">
            We may also use cookies or similar technologies for login sessions, security,
            analytics, performance, and site functionality.
          </p>
        </section>

        <section className="card">
          <h2 className="text-xl font-semibold">Public content</h2>
          <p className="mt-4 text-sm leading-7 text-muted">
            Your profile details, username, posts, comments, likes, and follows may be
            visible to other users or the public depending on the feature and page.
            Avoid posting private or sensitive information you do not want shared.
          </p>
        </section>

        <section className="card">
          <h2 className="text-xl font-semibold">Data requests</h2>
          <p className="mt-4 text-sm leading-7 text-muted">
            For privacy questions, account deletion requests, or data-related inquiries,
            contact <a href="mailto:legal@blackout-network.com" className="text-white hover:opacity-80">legal@blackout-network.com</a>.
          </p>
        </section>
      </div>
    </main>
  );
}
