
"use client";

import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  BookOpen,
  FileSearch,
  FileBarChart,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  FolderOpen,
  ClipboardCheck,
  Zap,
  AlertCircle,
  FileText,
  ShieldCheck,
} from "lucide-react";

interface AnalysisReport {
  analysis_id: number;
  document_id: number;
  filename: string;
  compliance_score: number;
  total_issues: number;
  analyzed_at: string;
}

const navigation = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Brand Guidelines", href: "/guidelines", icon: BookOpen },
  { label: "Content Review", href: "/review", icon: FileSearch },
  { label: "Reports", href: "/reports", icon: FileBarChart },
];

export default function Dashboard() {
  const [reports, setReports] = useState<AnalysisReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchReports() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analysis-history`);

        if (!response.ok) {
          throw new Error("Unable to load dashboard data.");
        }

        const data = await response.json();
        setReports(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchReports();
  }, []);

  const totalDocuments = new Set(
    reports.map((report) => report.document_id)
  ).size;

  const reviewsCompleted = reports.length;

  const issuesDetected = reports.reduce(
    (total, report) => total + report.total_issues,
    0
  );

  const pendingReviews = reports.filter(
    (report) => report.compliance_score < 80
  ).length;

  const statistics = [
    {
      title: "Total Documents",
      value: totalDocuments,
      description: "Unique documents analyzed",
      icon: FolderOpen,
    },
    {
      title: "Reviews Completed",
      value: reviewsCompleted,
      description: "Total analysis runs",
      icon: ClipboardCheck,
    },
    {
      title: "Issues Detected",
      value: issuesDetected,
      description: "Issues identified",
      icon: Zap,
    },
    {
      title: "Needs Review",
      value: pendingReviews,
      description: "Scores below 80%",
      icon: AlertCircle,
    },
  ];

  return (
    <main className="flex min-h-screen bg-[#F4EDE0] text-[#14213D]">

      {/* Sidebar */}
      <aside className="hidden w-72 shrink-0 flex-col bg-[#14213D] px-6 py-8 text-white md:flex">

        <a href="/dashboard" className="block">
          <h1 className="text-2xl font-extrabold tracking-tight">
            BrandGuard
            <span className="text-[#FF6B5B]">AI</span>
          </h1>

          <p className="mt-2 text-[10px] font-semibold tracking-[0.2em] text-white/50">
            BRAND GOVERNANCE PLATFORM
          </p>
        </a>

        <div className="mt-12">
          <p className="mb-4 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
            Workspace
          </p>

          <nav className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = item.href === "/dashboard";

              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium transition ${
                    active
                      ? "border border-[#FF6B5B]/30 bg-[#FF6B5B] text-[#14213D] shadow-lg shadow-black/10"
                      : "text-white/65 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon size={19} strokeWidth={2} />
                  {item.label}
                </a>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto">

          <a
            href="/"
            className="mb-6 flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/65 transition hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft size={18} />
            Back to Website
          </a>

          <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-5">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#FF6B5B] text-[#14213D]">
              <ShieldCheck size={23} />
            </div>

            <p className="font-bold">BrandGuard AI</p>

            <p className="mt-2 text-xs leading-5 text-white/55">
              Your intelligent brand protection workspace.
            </p>

            <div className="mt-5 h-1 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-2/3 rounded-full bg-[#FF6B5B]" />
            </div>
          </div>

          <p className="mt-6 text-center text-[10px] tracking-wide text-white/35">
            POWERED BY AI · BUILT FOR BRAND TRUST
          </p>
        </div>
      </aside>

      {/* Main Dashboard */}
      <section className="min-w-0 flex-1 px-5 py-7 sm:px-8 lg:px-10">

        {/* Header */}
        <header className="flex flex-col justify-between gap-5 border-b border-[#14213D]/10 pb-7 sm:flex-row sm:items-center">

          <div>
            <p className="text-xs font-bold tracking-[0.18em] text-[#FF6B5B]">
              WORKSPACE / OVERVIEW
            </p>

            <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Dashboard
              <span className="text-[#FF6B5B]">.</span>
            </h2>

            <p className="mt-2 text-sm text-[#14213D]/60">
              Welcome to your BrandGuard AI workspace.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start rounded-xl border border-[#14213D]/10 bg-white px-4 py-3 shadow-sm sm:self-auto">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#14213D] text-sm font-bold text-[#F4EDE0]">
              A
            </div>

            <div>
              <p className="text-sm font-bold">Administrator</p>
              <p className="text-xs text-[#14213D]/50">
                Workspace Access
              </p>
            </div>
          </div>
        </header>

        {/* Welcome Banner */}
        <div className="relative mt-8 overflow-hidden rounded-2xl bg-[#14213D] p-7 text-white shadow-lg sm:p-9">

          <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full bg-[#FF6B5B]/20 blur-[80px]" />

          <div className="relative">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-[#F4EDE0]">
              <Sparkles size={14} className="text-[#FF6B5B]" />
              Your brand. Your standards.
            </div>

            <h3 className="max-w-xl text-2xl font-bold leading-tight sm:text-3xl">
              Keep every piece of content
              <span className="text-[#FF6B5B]"> on brand.</span>
            </h3>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/65">
              Monitor compliance, review content and manage your brand guidelines from one workspace.
            </p>

            <a
              href="/review"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#FF6B5B] px-5 py-3 text-sm font-bold text-[#14213D] transition hover:-translate-y-0.5 hover:bg-[#ff8173]"
            >
              Review Content
              <ArrowRight size={17} />
            </a>
          </div>

          <div className="pointer-events-none absolute bottom-0 right-10 hidden text-white/[0.05] lg:block">
            <ShieldCheck size={180} strokeWidth={1} />
          </div>
        </div>

        {/* Statistics */}
        {loading ? (
          <div className="mt-10 rounded-2xl bg-white p-10 text-center shadow-sm">
            <p className="animate-pulse text-[#14213D]/60">
              Loading dashboard data...
            </p>
          </div>
        ) : error ? (
          <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
            {error}
          </div>
        ) : (
          <>
            <div className="mt-10">
              <div className="mb-5">
                <h3 className="text-xl font-bold">
                  Workspace Overview
                </h3>

                <p className="mt-1 text-sm text-[#14213D]/55">
                  Your brand compliance at a glance.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {statistics.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="group rounded-2xl border border-[#14213D]/10 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-[#14213D]/65">
                          {item.title}
                        </p>

                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                            index === 3
                              ? "bg-[#FF6B5B]/15 text-[#E65345]"
                              : "bg-[#14213D]/[0.07] text-[#14213D]"
                          }`}
                        >
                          <Icon size={21} />
                        </div>
                      </div>

                      <h3 className="mt-6 text-4xl font-extrabold tracking-tight">
                        {item.value}
                      </h3>

                      <p className="mt-2 text-xs text-[#14213D]/50">
                        {item.description}
                      </p>

                      <div
                        className={`mt-5 h-1 rounded-full ${
                          index === 3
                            ? "bg-[#FF6B5B]"
                            : "bg-[#14213D]/15"
                        }`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <section className="mt-12">
              <div className="mb-5">
                <h3 className="text-xl font-bold">Quick Actions</h3>

                <p className="mt-1 text-sm text-[#14213D]/55">
                  Everything you need to manage your brand.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">

                <div className="group rounded-2xl border border-[#14213D]/10 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FF6B5B]/15 text-[#14213D]">
                    <FileSearch size={27} />
                  </div>

                  <h4 className="mt-5 text-xl font-bold">
                    Review Content
                  </h4>

                  <p className="mt-2 text-sm leading-6 text-[#14213D]/60">
                    Check documents against your approved brand guidelines and identify compliance issues.
                  </p>

                  <a
                    href="/review"
                    className="mt-6 inline-flex items-center gap-2 font-bold text-[#E65345] transition group-hover:gap-3"
                  >
                    Start Review
                    <ArrowRight size={17} />
                  </a>
                </div>

                <div className="group rounded-2xl border border-[#14213D]/10 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#14213D]/[0.07] text-[#14213D]">
                    <BookOpen size={27} />
                  </div>

                  <h4 className="mt-5 text-xl font-bold">
                    Manage Guidelines
                  </h4>

                  <p className="mt-2 text-sm leading-6 text-[#14213D]/60">
                    Add and manage your organisation's approved brand rules and standards.
                  </p>

                  <a
                    href="/guidelines"
                    className="mt-6 inline-flex items-center gap-2 font-bold text-[#14213D] transition group-hover:gap-3"
                  >
                    Manage Guidelines
                    <ArrowRight size={17} />
                  </a>
                </div>

              </div>
            </section>

            {/* Recent Activity */}
            <section className="mt-12">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-xl font-bold">Recent Activity</h3>

                  <p className="mt-1 text-sm text-[#14213D]/55">
                    Your document analysis history.
                  </p>
                </div>

                <a
                  href="/reports"
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#E65345] transition hover:gap-3"
                >
                  View Reports
                  <ArrowRight size={16} />
                </a>
              </div>

              <div className="overflow-hidden rounded-2xl border border-[#14213D]/10 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px] text-left text-sm">
                    <thead className="border-b border-[#14213D]/10 bg-[#14213D]/[0.035] text-xs uppercase tracking-wider text-[#14213D]/50">
                      <tr>
                        <th className="px-6 py-5">Document</th>
                        <th className="px-6 py-5">Review Type</th>
                        <th className="px-6 py-5">Compliance Score</th>
                        <th className="px-6 py-5">Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {reports.map((report) => (
                        <tr
                          key={report.analysis_id}
                          className="border-b border-[#14213D]/[0.07] transition hover:bg-[#F4EDE0]/50"
                        >
                          <td className="px-6 py-5 font-semibold">
                            <div className="flex items-center gap-3">
                              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#14213D]/[0.07]">
                                <FileText size={18} />
                              </span>

                              {report.filename}
                            </div>
                          </td>

                          <td className="px-6 py-5 text-[#14213D]/60">
                            Brand Compliance
                          </td>

                          <td className="px-6 py-5 font-bold">
                            {report.compliance_score}%
                          </td>

                          <td className="px-6 py-5">
                            <span
                              className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${
                                report.compliance_score >= 80
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-[#FF6B5B]/15 text-[#B84236]"
                              }`}
                            >
                              {report.compliance_score >= 80
                                ? "Meets Threshold"
                                : "Needs Review"}
                            </span>
                          </td>
                        </tr>
                      ))}

                      {reports.length === 0 && (
                        <tr>
                          <td colSpan={4} className="p-10 text-center">
                            <FolderOpen
                              size={34}
                              className="mx-auto text-[#14213D]/30"
                            />

                            <p className="mt-3 font-bold">
                              No activity yet
                            </p>

                            <p className="mt-1 text-sm text-[#14213D]/50">
                              Analyze your first document to see activity here.
                            </p>

                            <a
                              href="/review"
                              className="mt-4 inline-flex items-center gap-2 font-bold text-[#E65345]"
                            >
                              Start your first review
                              <ArrowRight size={16} />
                            </a>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </>
        )}

        <footer className="mt-12 border-t border-[#14213D]/10 py-6 text-center text-xs text-[#14213D]/45">
          BrandGuard AI · Brand Governance Workspace
        </footer>
      </section>
    </main>
  );
}
