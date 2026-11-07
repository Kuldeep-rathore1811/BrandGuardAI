
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface ComplianceIssue {
  severity: string;
  type?: string;
  message?: string;
}

interface LogoAnalysis {
  status: string;
  matching_features: number;
  geometric_inliers: number;
  inlier_ratio?: number;
  message: string;
  image_id: number;
  page_number?: number | null;
}

interface AnalysisResultData {
  issues?: ComplianceIssue[];
  logo_analysis?: LogoAnalysis[];
}

interface AnalysisReport {
  analysis_id: number;
  document_id: number;
  filename: string;
  compliance_score: number;
  total_issues: number;
  analyzed_at: string;
  analysis_result?: AnalysisResultData;
}

export default function Reports() {
  const [reports, setReports] = useState<AnalysisReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchReports() {
      try {
        const response = await fetch(
          "https://brandguardai-jgyc.onrender.com/analysis-history"
        );

        if (!response.ok) {
          throw new Error("Unable to load analysis history.");
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

  const totalReviews = reports.length;

  const averageScore =
    totalReviews > 0
      ? Math.round(
          reports.reduce(
            (total, report) => total + report.compliance_score,
            0
          ) / totalReviews
        )
      : 0;

  const totalIssues = reports.reduce(
    (total, report) => total + report.total_issues,
    0
  );

  const approvedContent = reports.filter(
    (report) => report.compliance_score >= 80
  ).length;

  // Collect logo verification results from all reports.
  const allLogoResults = reports.flatMap(
    (report) => report.analysis_result?.logo_analysis || []
  );

  const totalLogoChecks = allLogoResults.length;

  const matchedLogos = allLogoResults.filter(
    (logo) => logo.status === "Likely logo match"
  ).length;

  const unverifiedLogos = allLogoResults.filter(
    (logo) => logo.status === "Logo not verified"
  ).length;

  const inconclusiveLogos = allLogoResults.filter(
    (logo) => logo.status === "Inconclusive"
  ).length;

  const statistics = [
    { title: "Total Reviews", value: totalReviews },
    { title: "Average Compliance", value: `${averageScore}%` },
    { title: "Issues Detected", value: totalIssues },
    { title: "Approved Content", value: approvedContent },
  ];

  const getLogoStatusStyle = (status: string) => {
    if (status === "Likely logo match") {
      return "bg-green-500/20 text-green-400";
    }

    if (status === "Logo not verified") {
      return "bg-red-500/20 text-red-400";
    }

    return "bg-yellow-500/20 text-yellow-400";
  };

  return (
    <main className="min-h-screen bg-[#0b1120] text-white flex">

      {/* Sidebar */}
      <aside className="w-64 bg-[#111c30] p-6 hidden md:block">
        <h1 className="text-2xl font-bold text-blue-400 mb-10">
          BrandGuard AI
        </h1>

        <nav className="space-y-5">
          <Link
            href="/dashboard"
            className="block text-gray-400 hover:text-white"
          >
            Overview
          </Link>

          <Link
            href="/guidelines"
            className="block text-gray-400 hover:text-white"
          >
            Brand Guidelines
          </Link>

          <Link
            href="/review"
            className="block text-gray-400 hover:text-white"
          >
            Content Review
          </Link>

          <Link
            href="/reports"
            className="block text-blue-400 font-semibold"
          >
            Reports
          </Link>

          <Link
            href="/"
            className="block text-gray-400 hover:text-white"
          >
            Back to Website
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <section className="flex-1 p-8 md:p-10">

        <div className="mb-8">
          <p className="text-blue-400 text-sm mb-2">
            BRAND ANALYTICS
          </p>

          <h2 className="text-3xl font-bold">
            Reports & Analytics
          </h2>

          <p className="text-gray-400 mt-2">
            Monitor brand compliance and review content performance.
          </p>
        </div>

        {loading ? (
          <p className="text-blue-400">Loading reports...</p>
        ) : error ? (
          <div className="bg-red-900/20 border border-red-700 p-5 rounded-xl text-red-300">
            {error}
          </div>
        ) : (
          <>
            {/* Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
              {statistics.map((item) => (
                <div
                  key={item.title}
                  className="bg-[#17243a] p-6 rounded-xl border border-gray-700"
                >
                  <p className="text-gray-400 text-sm">
                    {item.title}
                  </p>

                  <h3 className="text-3xl font-bold mt-3 text-blue-400">
                    {item.value}
                  </h3>
                </div>
              ))}
            </div>

            {/* Overall Compliance */}
            <div className="bg-[#17243a] border border-gray-700 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-semibold mb-5">
                Overall Brand Compliance
              </h3>

              <div className="flex items-center gap-6">
                <div className="w-28 h-28 rounded-full border-8 border-blue-400 flex items-center justify-center">
                  <span className="text-3xl font-bold">
                    {averageScore}%
                  </span>
                </div>

                <div>
                  <p className="text-blue-400 font-semibold">
                    {totalReviews === 0
                      ? "No Reviews Yet"
                      : averageScore >= 80
                      ? "Good Brand Consistency"
                      : "Improvement Needed"}
                  </p>

                  <p className="text-gray-400 text-sm mt-2">
                    {totalReviews === 0
                      ? "Upload and analyze a document to see your compliance score."
                      : `Average score calculated from ${totalReviews} document analyses.`}
                  </p>
                </div>
              </div>
            </div>

            {/* Issue Summary */}
            <div className="bg-[#17243a] border border-gray-700 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-semibold mb-5">
                Issue Summary
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div className="bg-[#202f48] p-5 rounded-lg">
                  <p className="text-red-400 font-semibold">
                    High Severity Issues
                  </p>

                  <h3 className="text-3xl font-bold mt-2">
                    {reports.reduce((total, report) => {
                      const issues =
                        report.analysis_result?.issues || [];

                      return (
                        total +
                        issues.filter(
                          (issue) => issue.severity === "High"
                        ).length
                      );
                    }, 0)}
                  </h3>
                </div>

                <div className="bg-[#202f48] p-5 rounded-lg">
                  <p className="text-yellow-400 font-semibold">
                    Medium Severity Issues
                  </p>

                  <h3 className="text-3xl font-bold mt-2">
                    {reports.reduce((total, report) => {
                      const issues =
                        report.analysis_result?.issues || [];

                      return (
                        total +
                        issues.filter(
                          (issue) => issue.severity === "Medium"
                        ).length
                      );
                    }, 0)}
                  </h3>
                </div>

              </div>

              <p className="text-gray-400 text-sm mt-4">
                These counts are based on the terminology checks currently implemented.
              </p>
            </div>

            {/* Logo Verification Summary */}
            <div className="bg-[#17243a] border border-gray-700 rounded-xl p-6 mb-8">

              <h3 className="text-xl font-semibold mb-2">
                Logo Verification Summary
              </h3>

              <p className="text-gray-400 text-sm mb-6">
                Overview of logo verification results across analyzed documents.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

                <div className="bg-[#202f48] p-5 rounded-lg">
                  <p className="text-gray-400 text-sm">
                    Total Logo Checks
                  </p>

                  <h3 className="text-3xl font-bold mt-2 text-blue-400">
                    {totalLogoChecks}
                  </h3>
                </div>

                <div className="bg-[#202f48] p-5 rounded-lg">
                  <p className="text-green-400 text-sm font-semibold">
                    Likely Matches
                  </p>

                  <h3 className="text-3xl font-bold mt-2 text-green-400">
                    {matchedLogos}
                  </h3>
                </div>

                <div className="bg-[#202f48] p-5 rounded-lg">
                  <p className="text-red-400 text-sm font-semibold">
                    Not Verified
                  </p>

                  <h3 className="text-3xl font-bold mt-2 text-red-400">
                    {unverifiedLogos}
                  </h3>
                </div>

                <div className="bg-[#202f48] p-5 rounded-lg">
                  <p className="text-yellow-400 text-sm font-semibold">
                    Inconclusive
                  </p>

                  <h3 className="text-3xl font-bold mt-2 text-yellow-400">
                    {inconclusiveLogos}
                  </h3>
                </div>

              </div>

              {/* Individual Logo Results */}
              <div className="mt-8">

                <h4 className="text-lg font-semibold mb-4">
                  Individual Logo Verification Results
                </h4>

                {totalLogoChecks === 0 ? (
                  <div className="bg-[#202f48] p-5 rounded-lg text-gray-400 text-sm">
                    No logo verification results found. Upload and analyze a document containing images to see results here.
                  </div>
                ) : (
                  <div className="space-y-4">

                    {reports.map((report) => {
                      const logoResults =
                        report.analysis_result?.logo_analysis || [];

                      if (logoResults.length === 0) {
                        return null;
                      }

                      return (
                        <div
                          key={report.analysis_id}
                          className="bg-[#202f48] rounded-lg p-5"
                        >

                          <div className="mb-4">
                            <p className="font-semibold">
                              {report.filename}
                            </p>

                            <p className="text-gray-400 text-xs mt-1">
                              Document ID: {report.document_id}
                            </p>
                          </div>

                          <div className="space-y-3">

                            {logoResults.map((logo, index) => (
                              <div
                                key={`${report.analysis_id}-${logo.image_id}-${index}`}
                                className="border border-gray-700 rounded-lg p-4"
                              >

                                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">

                                  <p className="font-medium">
                                    Image {logo.image_id}
                                    {logo.page_number
                                      ? ` · Page ${logo.page_number}`
                                      : ""}
                                  </p>

                                  <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getLogoStatusStyle(
                                      logo.status
                                    )}`}
                                  >
                                    {logo.status}
                                  </span>

                                </div>

                                <p className="text-gray-300 text-sm mb-3">
                                  {logo.message}
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                                  <div>
                                    <p className="text-gray-400 text-xs">
                                      Matching Features
                                    </p>

                                    <p className="font-semibold mt-1">
                                      {logo.matching_features}
                                    </p>
                                  </div>

                                  <div>
                                    <p className="text-gray-400 text-xs">
                                      Geometric Inliers
                                    </p>

                                    <p className="font-semibold mt-1">
                                      {logo.geometric_inliers}
                                    </p>
                                  </div>

                                  <div>
                                    <p className="text-gray-400 text-xs">
                                      Match Ratio
                                    </p>

                                    <p className="font-semibold mt-1">
                                      {logo.inlier_ratio !== undefined
                                        ? `${(logo.inlier_ratio * 100).toFixed(1)}%`
                                        : "N/A"}
                                    </p>
                                  </div>

                                </div>

                              </div>
                            ))}

                          </div>

                        </div>
                      );
                    })}

                  </div>
                )}

              </div>

              <p className="text-gray-500 text-xs mt-5">
                Logo verification uses visual feature matching and is an indicative check, not a guarantee of logo authenticity.
              </p>

            </div>

            {/* Review History */}
            <div className="bg-[#17243a] border border-gray-700 rounded-xl p-6">

              <h3 className="text-xl font-semibold mb-5">
                Recent Review History
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[600px]">

                  <thead>
                    <tr className="text-gray-400 border-b border-gray-700">
                      <th className="py-3">Document</th>
                      <th className="py-3">Date</th>
                      <th className="py-3">Score</th>
                      <th className="py-3">Issues</th>
                      <th className="py-3">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {reports.map((report) => (
                      <tr
                        key={report.analysis_id}
                        className="border-b border-gray-800"
                      >

                        <td className="py-4">
                          {report.filename}
                        </td>

                        <td className="py-4 text-gray-400">
                          {new Date(
                            report.analyzed_at
                          ).toLocaleDateString("en-IN")}
                        </td>

                        <td className="py-4 text-blue-400 font-semibold">
                          {report.compliance_score}%
                        </td>

                        <td className="py-4">
                          {report.total_issues}
                        </td>

                        <td className="py-4">
                          <span className="bg-[#263b58] px-3 py-1 rounded-full text-sm">
                            {report.compliance_score >= 80
                              ? "Approved"
                              : "Needs Review"}
                          </span>
                        </td>

                      </tr>
                    ))}

                    {reports.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="py-8 text-center text-gray-400"
                        >
                          No analysis history found. Review a document first.
                        </td>
                      </tr>
                    )}

                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        <p className="text-gray-500 text-xs mt-8">
          BrandGuard AI · Reports Dashboard
        </p>

      </section>
    </main>
  );
}
