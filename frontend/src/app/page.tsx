
export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* Navigation Bar */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold tracking-tight">
          BrandGuard<span className="text-blue-400">AI</span>
        </h1>

        <div className="hidden md:flex items-center gap-8 text-sm text-slate-300">
          <a href="#features" className="hover:text-blue-400">Features</a>
          <a href="#about" className="hover:text-blue-400">About</a>
          <a href="#contact" className="hover:text-blue-400">Contact</a>
          <a href="/dashboard" className="hover:text-blue-400">Dashboard</a>
        </div>

        <a
          href="/dashboard"
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold hover:bg-blue-500"
        >
          Get Started
        </a>
      </nav>

      {/* Hero Section */}
      <section className="flex min-h-[75vh] flex-col items-center justify-center px-6 text-center">
        <div className="mb-6 rounded-full border border-blue-500/30 bg-blue-500/10 px-5 py-2 text-sm text-blue-300">
          Intelligent Brand Governance Platform
        </div>

        <h2 className="max-w-4xl text-4xl font-bold leading-tight md:text-6xl">
          Protect Your Brand.
          <span className="block text-blue-400">
            Maintain Consistency.
          </span>
        </h2>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
          BrandGuard AI helps organisations review their content against
          approved brand guidelines, identify inconsistencies and maintain
          a consistent brand identity before publication.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <a
            href="/dashboard"
            className="rounded-lg bg-blue-600 px-8 py-3 font-semibold hover:bg-blue-500"
          >
            Explore Platform →
          </a>

          <a
            href="#about"
            className="rounded-lg border border-slate-700 px-8 py-3 font-semibold hover:bg-slate-800"
          >
            Learn More
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-slate-900 px-8 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              Everything Your Brand Needs
            </h2>
            <p className="mt-4 text-slate-400">
              One platform to review, manage and protect your brand identity.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">

            {/* Brand Guidelines */}
            <a
              href="/guidelines"
              className="block rounded-xl border border-slate-700 bg-slate-950 p-7 transition hover:border-blue-500 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <div className="text-3xl">📋</div>
              <h3 className="mt-5 text-xl font-semibold">Brand Guidelines →</h3>
              <p className="mt-3 leading-7 text-slate-400">
                Store approved brand rules, terminology, tone of voice
                and visual identity requirements.
              </p>
              <p className="mt-5 text-sm font-semibold text-blue-400">
                Manage Guidelines
              </p>
            </a>

            {/* Content Review */}
            <a
              href="/review"
              className="block rounded-xl border border-slate-700 bg-slate-950 p-7 transition hover:border-blue-500 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <div className="text-3xl">🤖</div>
              <h3 className="mt-5 text-xl font-semibold">AI Content Review →</h3>
              <p className="mt-3 leading-7 text-slate-400">
                Analyse content to identify incorrect claims,
                inconsistent messaging and brand violations.
              </p>
              <p className="mt-5 text-sm font-semibold text-blue-400">
                Review Content
              </p>
            </a>

            {/* Reports */}
            <a
              href="/reports"
              className="block rounded-xl border border-slate-700 bg-slate-950 p-7 transition hover:border-blue-500 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <div className="text-3xl">📊</div>
              <h3 className="mt-5 text-xl font-semibold">Review Reports →</h3>
              <p className="mt-3 leading-7 text-slate-400">
                Understand detected issues, suggested corrections
                and content review history.
              </p>
              <p className="mt-5 text-sm font-semibold text-blue-400">
                View Reports
              </p>
            </a>

          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="px-8 py-20 text-center">
        <h2 className="text-3xl font-bold">Why BrandGuard AI?</h2>
        <p className="mx-auto mt-5 max-w-3xl leading-8 text-slate-400">
          Every piece of published content represents an organisation.
          BrandGuard AI aims to help teams maintain accuracy, consistency
          and trust through intelligent content checking and human review.
        </p>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t border-slate-800 px-8 py-8 text-center text-sm text-slate-500">
        © 2026 BrandGuard AI. Intelligent Brand Governance.
      </footer>

    </main>
  );
}
