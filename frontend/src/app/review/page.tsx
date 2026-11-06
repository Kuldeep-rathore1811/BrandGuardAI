
"use client";

import { useState } from "react";

interface ComplianceIssue {
  type: string;
  severity: string;
  word?: string;
  message: string;
  position?: number;
  suggestion: string;
}

interface LogoAnalysis {
  status: string;
  matching_features: number;
  geometric_inliers: number;
  inlier_ratio?: number;
  message: string;
  image_id: number;
  page_number: number | null;
}

interface AnalysisResult {
  document_id: number;
  filename: string;
  company_name: string;
  compliance_score: number;
  total_issues: number;
  issues: ComplianceIssue[];
  logo_analysis: LogoAnalysis[];
}

export default function Review() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [documentId, setDocumentId] = useState<number | null>(null);
  const [analysisResult, setAnalysisResult] =
    useState<AnalysisResult | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      const validFile = /\.(pdf|docx)$/i.test(selectedFile.name);

      if (!validFile) {
        setFile(null);
        setAnalysisResult(null);
        setDocumentId(null);
        setMessage("Please select a PDF or DOCX file.");
        return;
      }

      setFile(selectedFile);
      setMessage("");
      setDocumentId(null);
      setAnalysisResult(null);
    }
  }

  async function handleReview() {
    if (!file) {
      setMessage("Please upload a document first.");
      return;
    }

    setUploading(true);
    setAnalysisResult(null);
    setDocumentId(null);
    setMessage("Uploading your document...");

    try {
      // STEP 1: Upload document
      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await fetch(
        "http://127.0.0.1:8000/upload-document",
        {
          method: "POST",
          body: formData,
        }
      );

      const uploadData = await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(
          uploadData.detail || "Document upload failed."
        );
      }

      const newDocumentId = uploadData.document_id;
      setDocumentId(newDocumentId);

      // STEP 2: Analyse document
      setMessage("Document uploaded! Analysing brand compliance...");

      const analysisResponse = await fetch(
        `http://127.0.0.1:8000/analyze-document/${newDocumentId}`,
        {
          method: "POST",
        }
      );

      const analysisData = await analysisResponse.json();

      if (!analysisResponse.ok) {
        throw new Error(
          analysisData.detail || "Document analysis failed."
        );
      }

      // STEP 3: Display results
      setAnalysisResult(analysisData);

      setMessage("Document analysis completed successfully!");
    } catch (error) {
      console.error("Review error:", error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong during document review."
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <main className="flex min-h-screen bg-slate-950 text-white">

      {/* Sidebar */}
      <aside className="hidden w-64 border-r border-slate-800 bg-slate-900 p-6 md:block">
        <h1 className="text-2xl font-bold">
          BrandGuard<span className="text-blue-400">AI</span>
        </h1>

        <p className="mt-2 text-xs text-slate-500">
          BRAND GOVERNANCE PLATFORM
        </p>

        <nav className="mt-12 space-y-3">
          <a
            href="/dashboard"
            className="block rounded-lg px-4 py-3 text-slate-400 hover:bg-slate-800"
          >
            Overview
          </a>

          <a
            href="/guidelines"
            className="block rounded-lg px-4 py-3 text-slate-400 hover:bg-slate-800"
          >
            Brand Guidelines
          </a>

          <a
            href="/review"
            className="block rounded-lg bg-blue-600 px-4 py-3 font-medium"
          >
            Content Review
          </a>

          <a
            href="/reports"
            className="block rounded-lg px-4 py-3 text-slate-400 hover:bg-slate-800"
          >
            Reports
          </a>

          <a
            href="/"
            className="block rounded-lg px-4 py-3 text-slate-400 hover:bg-slate-800"
          >
            Back to Website
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <section className="flex-1 p-6 md:p-10">

        <header className="border-b border-slate-800 pb-6">
          <p className="text-sm text-blue-400">
            WORKSPACE / CONTENT REVIEW
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Content Review
          </h2>

          <p className="mt-2 text-slate-400">
            Upload your documents and prepare them for brand compliance checking.
          </p>
        </header>

        <div className="mx-auto mt-10 max-w-4xl space-y-8">

          {/* Upload Section */}
          <div className="rounded-xl border border-slate-700 bg-slate-900 p-8">

            <h3 className="text-xl font-semibold">
              Upload Your Document
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              Select a document that you want BrandGuard AI to review.
            </p>

            <label
              htmlFor="document"
              className="mt-8 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-600 bg-slate-950 px-6 py-12 text-center transition hover:border-blue-500"
            >
              <span className="text-5xl">📄</span>

              <span className="mt-5 text-lg font-semibold">
                Click to upload a document
              </span>

              <span className="mt-2 text-sm text-slate-400">
                Supported formats: PDF and DOCX
              </span>

              <span className="mt-5 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold">
                Browse Files
              </span>

              <input
                id="document"
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileChange}
                className="hidden"
                disabled={uploading}
              />
            </label>

            {/* Selected File */}
            {file && (
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-blue-500/40 bg-blue-500/10 p-4">

                <div>
                  <p className="font-medium">{file.name}</p>

                  <p className="mt-1 text-xs text-slate-400">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>

                <button
                  onClick={() => {
                    setFile(null);
                    setMessage("");
                    setDocumentId(null);
                    setAnalysisResult(null);
                  }}
                  disabled={uploading}
                  className="text-sm text-red-400 hover:text-red-300 disabled:opacity-50"
                >
                  Remove
                </button>

              </div>
            )}

            {/* Review Button */}
            <button
              onClick={handleReview}
              disabled={uploading || !file}
              className="mt-7 w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {uploading
                ? "Uploading & Analysing..."
                : "Analyse Document →"}
            </button>

            {/* Status Message */}
            {message && (
              <p
                className={`mt-5 rounded-lg border border-slate-700 bg-slate-950 p-4 text-sm ${
                  analysisResult
                    ? "text-green-400"
                    : "text-blue-300"
                }`}
              >
                {message}
              </p>
            )}

          </div>

          {/* Analysis Results */}
          {analysisResult && (
            <div className="space-y-6">

              {/* Compliance Summary */}
              <div className="rounded-xl border border-slate-700 bg-slate-900 p-8">

                <p className="text-sm text-blue-400">
                  ANALYSIS REPORT
                </p>

                <h3 className="mt-2 text-xl font-bold">
                  Compliance Results
                </h3>

                <p className="mt-2 text-sm text-slate-400">
                  Document: {analysisResult.filename}
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  Company: {analysisResult.company_name}
                </p>

                <div className="mt-8 grid gap-5 sm:grid-cols-2">

                  <div className="rounded-xl border border-slate-700 bg-slate-950 p-6">
                    <p className="text-sm text-slate-400">
                      Compliance Score
                    </p>

                    <p className="mt-3 text-4xl font-bold text-green-400">
                      {analysisResult.compliance_score}%
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-700 bg-slate-950 p-6">
                    <p className="text-sm text-slate-400">
                      Total Issues Found
                    </p>

                    <p className="mt-3 text-4xl font-bold text-orange-400">
                      {analysisResult.total_issues}
                    </p>
                  </div>

                </div>
              </div>

              {/* Detected Issues */}
              <div className="rounded-xl border border-slate-700 bg-slate-900 p-8">

                <h3 className="text-xl font-bold">
                  Detected Issues
                </h3>

                {analysisResult.issues.length === 0 ? (
                  <p className="mt-5 rounded-lg bg-green-500/10 p-5 text-green-400">
                    No terminology issues detected! Your document passed the current rule-based checks.
                  </p>
                ) : (
                  <div className="mt-6 space-y-4">

                    {analysisResult.issues.map((issue, index) => (
                      <div
                        key={index}
                        className="rounded-xl border border-slate-700 bg-slate-950 p-5"
                      >

                        <div className="flex flex-wrap items-center justify-between gap-3">

                          <h4 className="font-semibold text-white">
                            {issue.type}
                          </h4>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              issue.severity === "High"
                                ? "bg-red-500/20 text-red-400"
                                : "bg-yellow-500/20 text-yellow-400"
                            }`}
                          >
                            {issue.severity} Severity
                          </span>

                        </div>

                        <p className="mt-3 text-sm text-slate-300">
                          {issue.message}
                        </p>

                        {issue.position !== undefined && (
                          <p className="mt-2 text-xs text-slate-500">
                            Text position: {issue.position}
                          </p>
                        )}

                        <div className="mt-4 rounded-lg bg-blue-500/10 p-4">
                          <p className="text-xs font-semibold text-blue-400">
                            SUGGESTED CORRECTION
                          </p>

                          <p className="mt-2 text-sm text-slate-300">
                            {issue.suggestion}
                          </p>
                        </div>

                      </div>
                    ))}

                  </div>
                )}

              </div>

              {/* Logo Verification Results */}
              <div className="rounded-xl border border-slate-700 bg-slate-900 p-8">

                <div className="flex items-center gap-3">
                  <span className="text-3xl">🛡️</span>

                  <div>
                    <h3 className="text-xl font-bold">
                      Logo Verification
                    </h3>

                    <p className="mt-1 text-sm text-slate-400">
                      Comparison with the approved reference logo
                    </p>
                  </div>
                </div>

                {!analysisResult.logo_analysis ||
                analysisResult.logo_analysis.length === 0 ? (

                  <p className="mt-6 rounded-lg bg-slate-950 p-5 text-slate-400">
                    No images were available for logo verification.
                  </p>

                ) : (

                  <div className="mt-6 space-y-4">

                    {analysisResult.logo_analysis.map((logo, index) => (

                      <div
                        key={logo.image_id ?? index}
                        className="rounded-xl border border-slate-700 bg-slate-950 p-5"
                      >

                        <div className="flex flex-wrap items-center justify-between gap-3">

                          <h4 className="font-semibold">
                            Image {index + 1}
                          </h4>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              logo.status === "Likely logo match"
                                ? "bg-green-500/20 text-green-400"
                                : logo.status === "Logo not verified"
                                ? "bg-red-500/20 text-red-400"
                                : "bg-yellow-500/20 text-yellow-400"
                            }`}
                          >
                            {logo.status}
                          </span>

                        </div>

                        <p className="mt-3 text-sm text-slate-300">
                          {logo.message}
                        </p>

                        <div className="mt-5 grid gap-4 sm:grid-cols-3">

                          <div className="rounded-lg bg-slate-900 p-4">
                            <p className="text-xs text-slate-400">
                              Matching Features
                            </p>

                            <p className="mt-2 text-2xl font-bold text-blue-400">
                              {logo.matching_features}
                            </p>
                          </div>

                          <div className="rounded-lg bg-slate-900 p-4">
                            <p className="text-xs text-slate-400">
                              Geometric Inliers
                            </p>

                            <p className="mt-2 text-2xl font-bold text-blue-400">
                              {logo.geometric_inliers}
                            </p>
                          </div>

                          <div className="rounded-lg bg-slate-900 p-4">
                            <p className="text-xs text-slate-400">
                              Match Ratio
                            </p>

                            <p className="mt-2 text-2xl font-bold text-blue-400">
                              {logo.inlier_ratio !== undefined
                                ? `${(logo.inlier_ratio * 100).toFixed(1)}%`
                                : "N/A"}
                            </p>
                          </div>

                        </div>

                        {logo.page_number !== null && (
                          <p className="mt-4 text-xs text-slate-500">
                            Page Number: {logo.page_number}
                          </p>
                        )}

                      </div>

                    ))}

                  </div>

                )}

                <p className="mt-5 text-xs text-slate-500">
                  Note: Logo verification uses visual feature matching.
                  Results are indicative and should be reviewed before final approval.
                </p>

              </div>

            </div>
          )}

          {/* What Will Be Checked */}
          <div>

            <h3 className="text-xl font-bold">
              What Will Be Checked?
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              BrandGuard AI is designed to examine these areas.
            </p>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">

              <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
                <div className="text-3xl">🎯</div>

                <h4 className="mt-3 font-semibold">
                  Tone Consistency
                </h4>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Checks whether the writing style matches the approved brand voice.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
                <div className="text-3xl">📝</div>

                <h4 className="mt-3 font-semibold">
                  Terminology
                </h4>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Identifies restricted words and incorrect brand terminology.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
                <div className="text-3xl">🔍</div>

                <h4 className="mt-3 font-semibold">
                  Content Accuracy
                </h4>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Helps identify outdated facts and unsupported promotional claims.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
                <div className="text-3xl">🎨</div>

                <h4 className="mt-3 font-semibold">
                  Visual Compliance
                </h4>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Designed to check logo usage, colours and visual identity rules.
                </p>
              </div>

            </div>
          </div>

          {/* Workflow */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">

            <h3 className="text-lg font-semibold">
              Review Workflow
            </h3>

            <div className="mt-6 grid gap-5 sm:grid-cols-4">

              <div>
                <p className="text-sm font-bold text-blue-400">01</p>
                <p className="mt-2 font-medium">Upload</p>
                <p className="mt-1 text-xs text-slate-400">
                  Select document
                </p>
              </div>

              <div>
                <p className="text-sm font-bold text-blue-400">02</p>
                <p className="mt-2 font-medium">Analyse</p>
                <p className="mt-1 text-xs text-slate-400">
                  Check brand rules
                </p>
              </div>

              <div>
                <p className="text-sm font-bold text-blue-400">03</p>
                <p className="mt-2 font-medium">Review</p>
                <p className="mt-1 text-xs text-slate-400">
                  Examine issues
                </p>
              </div>

              <div>
                <p className="text-sm font-bold text-blue-400">04</p>
                <p className="mt-2 font-medium">Approve</p>
                <p className="mt-1 text-xs text-slate-400">
                  Final approval
                </p>
              </div>

            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
