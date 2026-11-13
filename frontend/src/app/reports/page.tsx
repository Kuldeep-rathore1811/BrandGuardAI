
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Settings,
  FileText,
  Upload,
  BarChart3,
  ShieldCheck,
  Search,
  RefreshCw,
  FileCheck,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  ExternalLink,
} from "lucide-react";

interface AnalysisReport {
  analysis_id: number;
  document_id: number;
  filename: string;
  compliance_score: number;
  total_issues: number;
  analyzed_at: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function ReportsPage() {
  const [reports, setReports] = useState<AnalysisReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE}/analysis-history`);

      if (!response.ok) {
        throw new Error("Unable to load analysis history.");
      }

      const data = await response.json();
      setReports(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading reports."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const filteredReports = useMemo(() => {
    return reports.filter((report) =>
      report.filename?.toLowerCase().includes(search.toLowerCase())
    );
  }, [reports, search]);

  const totalReviews = reports.length;

  const averageScore =
    totalReviews > 0
      ? Math.round(
          reports.reduce(
            (total, report) => total + Number(report.compliance_score || 0),
            0
          ) / totalReviews
        )
      : 0;

  const totalIssues = reports.reduce(
    (total, report) => total + Number(report.total_issues || 0),
    0
  );

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 50) return "text-orange-500";
    return "text-red-500";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Good";
    if (score >= 50) return "Needs improvement";
    return "Critical";
  };

  return (
    <div className="min-h-screen bg-[#F4EDE0] text-[#14213D] md:flex">

      {/* Sidebar */}
      <aside className="w-full bg-[#14213D] text-white md:fixed md:inset-y-0 md:left-0 md:flex md:w-64 md:flex-col">
        <div className="border-b border-white/10 px-6 py-7">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF6B5B]">
              <ShieldCheck size={23} />
            </div>
            <div>
              <h1 className="text-xl font-bold">BrandGuard AI</h1>
              <p className="text-xs text-white/60">Brand protection platform</p>
            </div>
          </div>
        </div>

        <nav className="flex gap-1 overflow-x-auto p-4 md:flex-1 md:flex-col">
          <Link href="/dashboard" className="flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/70 transition hover:bg-white/10 hover:text-white">
            <LayoutDashboard size={19} />
            Overview
          </Link>

          <Link href="/guidelines" className="flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/70 transition hover:bg-white/10 hover:text-white">
            <Settings size={19} />
            Brand Guidelines
          </Link>

          <Link href="/review" className="flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/70 transition hover:bg-white/10 hover:text-white">
            <Upload size={19} />
            Content Review
          </Link>

          <Link href="/reports" className="flex shrink-0 items-center gap-3 rounded-xl bg-[#FF6B5B] px-4 py-3 text-sm font-semibold text-white">
            <BarChart3 size={19} />
            Reports
          </Link>
        </nav>

        <div className="hidden border-t border-white/10 p-5 md:block">
          <p className="text-xs text-white/50">AI-powered brand governance</p>
          <p className="mt-1 text-sm font-medium">Protect your brand identity.</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="min-w-0 flex-1 p-5 sm:p-8 md:ml-64 lg:p-10">

        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-[#FF6B5B]">
              Performance & insights
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Reports & Analytics
            </h2>
            <p className="mt-2 text-sm text-[#687386]">
              Track content reviews and monitor your brand compliance.
            </p>
          </div>

          <button
            onClick={fetchReports}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#14213D] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#24395F] disabled:opacity-60"
          >
            <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
            Refresh Reports
          </button>
        </div>

        {/* Statistics */}
        <div className="mb-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">

          <div className="rounded-2xl border border-[#E5DED2] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-blue-50 p-3 text-[#14213D]">
                <FileCheck size={23} />
              </div>
              <ArrowUpRight className="text-[#687386]" size={20} />
            </div>
            <p className="mt-5 text-sm font-medium text-[#687386]">
              Total Content Reviews
            </p>
            <h3 className="mt-1 text-3xl font-bold">{totalReviews}</h3>
            <p className="mt-2 text-xs text-[#687386]">
              Documents analyzed
            </p>
          </div>

          <div className="rounded-2xl border border-[#E5DED2] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-orange-50 p-3 text-[#FF6B5B]">
                <BarChart3 size={23} />
              </div>
              <ArrowUpRight className="text-[#687386]" size={20} />
            </div>
            <p className="mt-5 text-sm font-medium text-[#687386]">
              Average Compliance Score
            </p>
            <h3 className="mt-1 text-3xl font-bold">{averageScore}%</h3>
            <p className="mt-2 text-xs text-[#687386]">
              Across all analyzed documents
            </p>
          </div>

          <div className="rounded-2xl border border-[#E5DED2] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-red-50 p-3 text-red-500">
                <AlertTriangle size={23} />
              </div>
              <ArrowUpRight className="text-[#687386]" size={20} />
            </div>
            <p className="mt-5 text-sm font-medium text-[#687386]">
              Total Issues Detected
            </p>
            <h3 className="mt-1 text-3xl font-bold">{totalIssues}</h3>
            <p className="mt-2 text-xs text-[#687386]">
              Issues found during content reviews
            </p>
          </div>
        </div>

        {/* History Section */}
        <section className="overflow-hidden rounded-2xl border border-[#E5DED2] bg-white shadow-sm">

          <div className="flex flex-col justify-between gap-4 border-b border-[#E5DED2] p-6 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-xl font-bold">Analysis History</h3>
              <p className="mt-1 text-sm text-[#687386]">
                View all previously analyzed documents.
              </p>
            </div>

            <div className="relative w-full sm:max-w-xs">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#687386]"
              />
              <input
                type="text"
                placeholder="Search documents..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-[#E5DED2] bg-[#FAF8F4] py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#FF6B5B]"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
              <RefreshCw size={30} className="animate-spin text-[#FF6B5B]" />
              <p className="mt-4 text-sm font-medium">Loading reports...</p>
            </div>
          ) : error ? (
            <div className="px-6 py-16 text-center">
              <AlertTriangle className="mx-auto text-red-500" size={35} />
              <p className="mt-4 font-semibold">Unable to load reports</p>
              <p className="mt-2 text-sm text-[#687386]">{error}</p>
              <button
                onClick={fetchReports}
                className="mt-5 rounded-xl bg-[#14213D] px-5 py-3 text-sm font-semibold text-white"
              >
                Try Again
              </button>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="px-6 py-20 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F4EDE0] text-[#14213D]">
                <FileText size={30} />
              </div>
              <h4 className="mt-5 text-lg font-bold">
                {search ? "No matching reports" : "No reports yet"}
              </h4>
              <p className="mx-auto mt-2 max-w-sm text-sm text-[#687386]">
                {search
                  ? "Try searching with a different document name."
                  : "Upload and analyze your first document to see its report here."}
              </p>
              {!search && (
                <Link
                  href="/review"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#FF6B5B] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#f45b4b]"
                >
                  <Upload size={17} />
                  Review Content
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px] text-left">
                <thead className="bg-[#FAF8F4] text-xs uppercase tracking-wider text-[#687386]">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Document</th>
                    <th className="px-6 py-4 font-semibold">Analysis ID</th>
                    <th className="px-6 py-4 font-semibold">Compliance</th>
                    <th className="px-6 py-4 font-semibold">Issues</th>
                    <th className="px-6 py-4 font-semibold">Review Date</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#E5DED2]">
                  {filteredReports.map((report) => (
                    <tr
                      key={report.analysis_id}
                      className="transition hover:bg-[#FAF8F4]"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-[#F4EDE0] p-2 text-[#14213D]">
                            <FileText size={19} />
                          </div>
                          <div>
                            <p className="max-w-[220px] truncate text-sm font-semibold">
                              {report.filename}
                            </p>
                            <p className="mt-1 text-xs text-[#687386]">
                              Document #{report.document_id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5 text-sm font-medium">
                        #{report.analysis_id}
                      </td>

                      <td className="px-6 py-5">
                        <span className={`text-sm font-bold ${getScoreColor(Number(report.compliance_score))}`}>
                          {report.compliance_score}%
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <span className="rounded-lg bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-600">
                          {report.total_issues}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-sm text-[#687386]">
                          <Clock size={15} />
                          {report.analyzed_at
                            ? new Date(report.analyzed_at).toLocaleDateString()
                            : "—"}
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                          Number(report.compliance_score) >= 80
                            ? "bg-green-50 text-green-700"
                            : Number(report.compliance_score) >= 50
                            ? "bg-orange-50 text-orange-700"
                            : "bg-red-50 text-red-700"
                        }`}>
                          {getScoreLabel(Number(report.compliance_score))}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && !error && filteredReports.length > 0 && (
            <div className="border-t border-[#E5DED2] px-6 py-4 text-xs text-[#687386]">
              Showing {filteredReports.length} of {totalReviews} reports
            </div>
          )}
        </section>

        {/* Footer Note */}
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-[#E5DED2] bg-white/70 p-5">
          <ShieldCheck className="mt-0.5 shrink-0 text-[#FF6B5B]" size={21} />
          <div>
            <p className="text-sm font-semibold">BrandGuard AI Insights</p>
            <p className="mt-1 text-xs leading-5 text-[#687386]">
              These reports summarize automated brand-compliance checks.
              Review detected issues and suggested corrections before
              publishing content. Final approval should remain with a human
              reviewer.
            </p>
          </div>
        </div>

      </main>
    </div>
  );
}
