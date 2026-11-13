
import Link from "next/link";
import {
  ShieldCheck,
  FileCheck,
  Bot,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ScanSearch,
  LockKeyhole,
  FileText,
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F4EDE0] text-[#14213D]">

      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-[#E5DED2] bg-[#F4EDE0]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">

          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#14213D] text-white">
              <ShieldCheck size={25} />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight">
                BrandGuard <span className="text-[#FF6B5B]">AI</span>
              </h1>
              <p className="text-[10px] font-medium tracking-wider text-[#687386]">
                INTELLIGENT BRAND GOVERNANCE
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-8 text-sm font-medium text-[#687386] md:flex">
            <a href="#features" className="transition hover:text-[#FF6B5B]">Features</a>
            <a href="#about" className="transition hover:text-[#FF6B5B]">About</a>
            <a href="#contact" className="transition hover:text-[#FF6B5B]">Contact</a>
            <Link href="/dashboard" className="transition hover:text-[#FF6B5B]">Dashboard</Link>
          </div>

          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-xl bg-[#FF6B5B] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#f45b4b]"
          >
            Get Started <ArrowRight size={16} />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 py-24 lg:py-32">
        <div className="pointer-events-none absolute -right-32 -top-24 h-96 w-96 rounded-full bg-[#FF6B5B]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-[#14213D]/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">

          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#FF6B5B]/30 bg-white px-4 py-2 text-sm font-semibold text-[#14213D] shadow-sm">
              <Sparkles size={16} className="text-[#FF6B5B]" />
              AI-Powered Brand Governance
            </div>

            <h2 className="max-w-2xl text-5xl font-extrabold leading-[1.12] tracking-tight sm:text-6xl lg:text-7xl">
              Protect Your Brand.
              <span className="mt-2 block text-[#FF6B5B]">
                Build Consistency.
              </span>
            </h2>

            <p className="mt-7 max-w-xl text-base leading-8 text-[#687386] sm:text-lg">
              Your brand deserves consistency at every touchpoint.
              BrandGuard AI reviews content against approved guidelines,
              detects inconsistencies and helps teams protect their
              brand identity before publication.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/dashboard"
                className="flex items-center justify-center gap-3 rounded-xl bg-[#14213D] px-7 py-4 font-bold text-white shadow-lg transition hover:-translate-y-1 hover:bg-[#24395F]"
              >
                Explore Platform <ArrowRight size={19} />
              </Link>

              <a
                href="#features"
                className="flex items-center justify-center gap-2 rounded-xl border border-[#14213D]/20 bg-white px-7 py-4 font-bold transition hover:border-[#FF6B5B] hover:text-[#FF6B5B]"
              >
                Discover Features
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-[#687386]">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-[#FF6B5B]" />
                AI-assisted review
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-[#FF6B5B]" />
                Brand consistency
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-[#FF6B5B]" />
                Human oversight
              </span>
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute -inset-5 rounded-[2rem] bg-[#FF6B5B]/10 blur-2xl" />

            <div className="relative overflow-hidden rounded-3xl border border-[#E5DED2] bg-white p-6 shadow-2xl sm:p-8">

              <div className="flex items-center justify-between border-b border-[#E5DED2] pb-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-[#14213D] p-3 text-white">
                    <ShieldCheck size={23} />
                  </div>
                  <div>
                    <h3 className="font-bold">Brand Analysis</h3>
                    <p className="text-xs text-[#687386]">AI compliance overview</p>
                  </div>
                </div>
                <span className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700">
                  Analysis Ready
                </span>
              </div>

              <div className="py-8 text-center">
                <div className="relative mx-auto flex h-36 w-36 items-center justify-center rounded-full border-[10px] border-[#F4EDE0]">
                  <div className="absolute inset-0 rounded-full border-[10px] border-[#FF6B5B] border-r-transparent border-b-transparent -rotate-45" />
                  <div>
                    <p className="text-4xl font-extrabold">AI</p>
                    <p className="text-xs font-medium text-[#687386]">Powered</p>
                  </div>
                </div>
                <h3 className="mt-5 text-xl font-bold">Smarter Brand Reviews</h3>
                <p className="mt-2 text-sm text-[#687386]">
                  Analyze content before it reaches your audience.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 rounded-xl bg-[#F4EDE0]/70 p-4">
                  <CheckCircle2 className="shrink-0 text-green-600" size={20} />
                  <div>
                    <p className="text-sm font-semibold">Brand Guidelines</p>
                    <p className="text-xs text-[#687386]">Approved rules and terminology</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-[#F4EDE0]/70 p-4">
                  <ScanSearch className="shrink-0 text-[#FF6B5B]" size={20} />
                  <div>
                    <p className="text-sm font-semibold">Content Analysis</p>
                    <p className="text-xs text-[#687386]">AI-assisted issue detection</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-[#F4EDE0]/70 p-4">
                  <FileCheck className="shrink-0 text-[#14213D]" size={20} />
                  <div>
                    <p className="text-sm font-semibold">Review Reports</p>
                    <p className="text-xs text-[#687386]">Insights and suggested corrections</p>
                  </div>
                </div>
              </div>

              <p className="mt-5 text-center text-[10px] text-[#687386]">
                Illustrative platform preview
              </p>
            </div>

            <div className="absolute -bottom-5 -left-5 hidden rounded-2xl bg-[#14213D] p-4 text-white shadow-xl sm:block">
              <div className="flex items-center gap-3">
                <LockKeyhole className="text-[#FF6B5B]" size={23} />
                <div>
                  <p className="text-sm font-bold">Brand Protection</p>
                  <p className="text-xs text-white/60">Consistency starts here</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-white px-6 py-24">
        <div className="mx-auto max-w-7xl">

          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#FF6B5B]">
              The Platform
            </p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl">
              Everything Your Brand Needs
            </h2>
            <p className="mt-5 leading-8 text-[#687386]">
              A unified workspace to manage guidelines, analyze content
              and understand brand compliance.
            </p>
          </div>

          <div className="mt-14 grid gap-7 md:grid-cols-2 lg:grid-cols-3">

            <Link
              href="/guidelines"
              className="group rounded-2xl border border-[#E5DED2] bg-[#F4EDE0]/50 p-8 transition duration-300 hover:-translate-y-2 hover:border-[#FF6B5B] hover:shadow-xl"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#14213D] text-white transition group-hover:bg-[#FF6B5B]">
                <FileText size={27} />
              </div>
              <h3 className="mt-7 text-xl font-bold">Brand Guidelines</h3>
              <p className="mt-3 leading-7 text-[#687386]">
                Store approved brand rules, terminology, tone of voice
                and visual identity requirements.
              </p>
              <p className="mt-6 flex items-center gap-2 text-sm font-bold text-[#FF6B5B]">
                Manage Guidelines <ArrowRight size={17} />
              </p>
            </Link>

            <Link
              href="/review"
              className="group rounded-2xl border border-[#E5DED2] bg-[#F4EDE0]/50 p-8 transition duration-300 hover:-translate-y-2 hover:border-[#FF6B5B] hover:shadow-xl"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#14213D] text-white transition group-hover:bg-[#FF6B5B]">
                <Bot size={27} />
              </div>
              <h3 className="mt-7 text-xl font-bold">AI Content Review</h3>
              <p className="mt-3 leading-7 text-[#687386]">
                Analyze documents to identify brand violations,
                inconsistent messaging and potentially misleading claims.
              </p>
              <p className="mt-6 flex items-center gap-2 text-sm font-bold text-[#FF6B5B]">
                Review Content <ArrowRight size={17} />
              </p>
            </Link>

            <Link
              href="/reports"
              className="group rounded-2xl border border-[#E5DED2] bg-[#F4EDE0]/50 p-8 transition duration-300 hover:-translate-y-2 hover:border-[#FF6B5B] hover:shadow-xl"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#14213D] text-white transition group-hover:bg-[#FF6B5B]">
                <BarChart3 size={27} />
              </div>
              <h3 className="mt-7 text-xl font-bold">Reports & Analytics</h3>
              <p className="mt-3 leading-7 text-[#687386]">
                Track compliance scores, understand detected issues
                and explore your content review history.
              </p>
              <p className="mt-6 flex items-center gap-2 text-sm font-bold text-[#FF6B5B]">
                View Reports <ArrowRight size={17} />
              </p>
            </Link>

          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="px-6 py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#FF6B5B]">
              Why BrandGuard AI?
            </p>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-5xl">
              Every Piece of Content Represents Your Brand.
            </h2>
            <p className="mt-6 leading-8 text-[#687386]">
              From marketing campaigns to everyday communications,
              inconsistent content can affect how people perceive
              an organization. BrandGuard AI helps teams identify
              potential problems before publication.
            </p>
            <p className="mt-4 leading-8 text-[#687386]">
              By combining AI-assisted analysis with human oversight,
              the platform supports more accurate, consistent and
              responsible brand communication.
            </p>

            <Link
              href="/dashboard"
              className="mt-8 inline-flex items-center gap-3 rounded-xl bg-[#FF6B5B] px-6 py-4 font-bold text-white transition hover:-translate-y-1 hover:bg-[#f45b4b]"
            >
              Start Protecting Your Brand <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="rounded-2xl bg-[#14213D] p-7 text-white sm:translate-y-8">
              <ShieldCheck size={32} className="text-[#FF6B5B]" />
              <h3 className="mt-6 text-xl font-bold">Consistency</h3>
              <p className="mt-3 text-sm leading-7 text-white/65">
                Align content with approved brand guidelines and identity.
              </p>
            </div>

            <div className="rounded-2xl border border-[#E5DED2] bg-white p-7">
              <ScanSearch size={32} className="text-[#FF6B5B]" />
              <h3 className="mt-6 text-xl font-bold">Intelligence</h3>
              <p className="mt-3 text-sm leading-7 text-[#687386]">
                Identify potential issues through AI-assisted analysis.
              </p>
            </div>

            <div className="rounded-2xl border border-[#E5DED2] bg-white p-7">
              <FileCheck size={32} className="text-[#FF6B5B]" />
              <h3 className="mt-6 text-xl font-bold">Transparency</h3>
              <p className="mt-3 text-sm leading-7 text-[#687386]">
                Understand detected issues and suggested improvements.
              </p>
            </div>

            <div className="rounded-2xl bg-[#FF6B5B] p-7 text-white sm:translate-y-8">
              <LockKeyhole size={32} />
              <h3 className="mt-6 text-xl font-bold">Human Oversight</h3>
              <p className="mt-3 text-sm leading-7 text-white/80">
                Keep people involved in final content review and approval.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Call to Action */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-[#14213D] px-7 py-16 text-center text-white sm:px-12">
          <Sparkles className="mx-auto text-[#FF6B5B]" size={35} />
          <h2 className="mt-6 text-3xl font-extrabold sm:text-5xl">
            Make Every Message
            <span className="block text-[#FF6B5B]">Brand-Consistent.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-8 text-white/65">
            Bring your brand guidelines and content reviews together
            in one intelligent workspace.
          </p>
          <Link
            href="/dashboard"
            className="mt-8 inline-flex items-center gap-3 rounded-xl bg-[#FF6B5B] px-8 py-4 font-bold text-white transition hover:-translate-y-1 hover:bg-[#f45b4b]"
          >
            Explore BrandGuard AI <ArrowRight size={19} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t border-[#E5DED2] bg-white px-6 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 sm:flex-row">

          <Link href="/" className="flex items-center gap-3">
            <div className="rounded-xl bg-[#14213D] p-2.5 text-white">
              <ShieldCheck size={22} />
            </div>
            <div>
              <p className="font-extrabold">
                BrandGuard <span className="text-[#FF6B5B]">AI</span>
              </p>
              <p className="text-xs text-[#687386]">Intelligent Brand Governance</p>
            </div>
          </Link>

          <p className="text-center text-sm text-[#687386]">
            © 2026 BrandGuard AI. All rights reserved.
          </p>

          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm font-bold text-[#14213D] transition hover:text-[#FF6B5B]"
          >
            Open Dashboard <ArrowRight size={16} />
          </Link>

        </div>
      </footer>

    </main>
  );
}
