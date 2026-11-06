
"use client";

import { useEffect, useState } from "react";

interface AnalysisReport {
  analysis_id: number;
  document_id: number;
  filename: string;
  compliance_score: number;
  total_issues: number;
  analyzed_at: string;
}

export default function Dashboard() {
  const [reports, setReports] = useState<AnalysisReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchReports() {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/analysis-history"
        );

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
      color: "text-blue-400",
    },
    {
      title: "Reviews Completed",
      value: reviewsCompleted,
      description: "Total analysis runs",
      color: "text-green-400",
    },
    {
      title: "Issues Detected",
      value: issuesDetected,
      description: "Issues identified",
      color: "text-yellow-400",
    },
    {
      title: "Needs Review",
      value: pendingReviews,
      description: "Scores below 80%",
      color: "text-purple-400",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white flex">

      {/* Sidebar */}
      <aside className="w-64 min-h-screen border-r border-slate-800 bg-slate-900 p-6 hidden md:block">

        <h1 className="text-2xl font-bold">
          BrandGuard<span className="text-blue-400">AI</span>
        </h1>

        <p className="mt-2 text-xs text-slate-500">
          BRAND GOVERNANCE PLATFORM
        </p>

        <nav className="mt-12 space-y-3">
          <a href="/dashboard" className="block rounded-lg bg-blue-600 px-4 py-3 font-medium">
            Overview
          </a>

          <a href="/guidelines" className="block rounded-lg px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white">
            Brand Guidelines
          </a>

          <a href="/review" className="block rounded-lg px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white">
            Content Review
          </a>

          <a href="/reports" className="block rounded-lg px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white">
            Reports
          </a>

          <a href="/" className="block rounded-lg px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white">
            Back to Website
          </a>
        </nav>

        <div className="mt-16 rounded-xl border border-slate-700 p-4">
          <p className="text-sm font-semibold">BrandGuard AI</p>
          <p className="mt-2 text-xs text-slate-400">
            Your intelligent brand protection workspace.
          </p>
        </div>

      </aside>

      {/* Main Dashboard */}
      <section className="flex-1 p-6 md:p-10">

        {/* Header */}
        <header className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-6 sm:flex-row sm:items-center">

          <div>
            <p className="text-sm text-blue-400">WORKSPACE / OVERVIEW</p>
            <h2 className="mt-2 text-3xl font-bold">
              Dashboard
            </h2>
            <p className="mt-2 text-slate-400">
              Welcome to your BrandGuard AI workspace.
            </p>
          </div>

          <div className="rounded-lg border border-slate-700 px-4 py-3 text-sm text-slate-300">
            Administrator Workspace
          </div>

        </header>

        {/* Statistics */}
        {loading ? (
          <p className="mt-8 text-blue-400">Loading dashboard...</p>
        ) : error ? (
          <div className="mt-8 rounded-xl border border-red-700 bg-red-900/20 p-5 text-red-300">
            {error}
          </div>
        ) : (
          <>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

              {statistics.map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-slate-800 bg-slate-900 p-6"
                >
                  <p className="text-sm text-slate-400">
                    {item.title}
                  </p>

                  <h3 className="mt-3 text-3xl font-bold">
                    {item.value}
                  </h3>

                  <p className={`mt-2 text-xs ${item.color}`}>
                    {item.description}
                  </p>
                </div>
              ))}

            </div>

            {/* Quick Actions */}
            <section className="mt-10">
              <h3 className="text-xl font-bold">Quick Actions</h3>
              <p className="mt-2 text-sm text-slate-400">
                Start managing your brand content.
              </p>

              <div className="mt-5 grid gap-5 md:grid-cols-2">

                <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
                  <div className="text-3xl">📄</div>
                  <h4 className="mt-4 text-lg font-semibold">
                    Review Content
                  </h4>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Check documents against your approved brand guidelines.
                  </p>
                  <a href="/review" className="mt-5 inline-block font-medium text-blue-400">
                    Start Review →
                  </a>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
                  <div className="text-3xl">📋</div>
                  <h4 className="mt-4 text-lg font-semibold">
                    Manage Guidelines
                  </h4>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Add and manage your organisation's brand rules.
                  </p>
                  <a href="/guidelines" className="mt-5 inline-block font-medium text-blue-400">
                    Manage Guidelines →
                  </a>
                </div>

              </div>
            </section>

            {/* Recent Activity */}
            <section className="mt-10">
              <h3 className="text-xl font-bold">Recent Activity</h3>

              <div className="mt-5 overflow-x-auto rounded-xl border border-slate-800 bg-slate-900">

                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-800 text-slate-400">
                    <tr>
                      <th className="p-5">Document</th>
                      <th className="p-5">Review Type</th>
                      <th className="p-5">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {reports.map((report) => (
                      <tr
                        key={report.analysis_id}
                        className="border-b border-slate-800"
                      >
                        <td className="p-5">{report.filename}</td>

                        <td className="p-5 text-slate-400">
                          Brand Compliance
                        </td>

                        <td className={`p-5 ${
                          report.compliance_score >= 80
                            ? "text-green-400"
                            : "text-yellow-400"
                        }`}>
                          {report.compliance_score >= 80
                            ? "Meets Threshold"
                            : "Needs Review"}
                        </td>
                      </tr>
                    ))}

                    {reports.length === 0 && (
                      <tr>
                        <td colSpan={3} className="p-8 text-center text-slate-400">
                          No activity yet. Analyze your first document!
                        </td>
                      </tr>
                    )}
                  </tbody>

                </table>

              </div>
            </section>
          </>
        )}

      </section>
    </main>
  );
}
