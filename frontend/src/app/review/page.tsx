
"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  LayoutDashboard,
  BookOpen,
  FileSearch,
  ClipboardList,
  Globe,
  UploadCloud,
  FileText,
  FileCheck,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Lightbulb,
  Palette,
  Image as ImageIcon,
  Search,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

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

type MessageType = "info" | "success" | "error";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function Review() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<MessageType>("info");
  const [uploading, setUploading] = useState(false);
  const [analysisResult, setAnalysisResult] =
    useState<AnalysisResult | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    const validFile = /\.(pdf|docx)$/i.test(selectedFile.name);

    if (!validFile) {
      setFile(null);
      setAnalysisResult(null);
      setMessage("Please select a PDF or DOCX file.");
      setMessageType("error");
      e.target.value = "";
      return;
    }

    setFile(selectedFile);
    setMessage("");
    setAnalysisResult(null);
  }

  function removeFile() {
    setFile(null);
    setMessage("");
    setAnalysisResult(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleReview() {
    if (!file) {
      setMessage("Please upload a document first.");
      setMessageType("error");
      return;
    }

    setUploading(true);
    setAnalysisResult(null);
    setMessage("Uploading your document...");
    setMessageType("info");

    try {
      // STEP 1: Upload document
      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await fetch(
        `${API_BASE}/upload-document`,
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

      // STEP 2: Analyse document
      setMessage("Document uploaded! Analysing brand compliance...");

      const analysisResponse = await fetch(
        `${API_BASE}/analyze-document/${newDocumentId}`,
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
      setMessageType("success");
    } catch (error) {
      console.error("Review error:", error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong during document review."
      );

      setMessageType("error");
    } finally {
      setUploading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-[#E5DED2] bg-[#FAF8F4] px-4 py-3 text-sm text-[#14213D] outline-none transition focus:border-[#FF6B5B] focus:ring-2 focus:ring-[#FF6B5B]/10";

  function getSeverityStyle(severity: string) {
    if (severity.toLowerCase() === "high") {
      return "bg-red-50 text-red-700 border-red-200";
    }

    if (severity.toLowerCase() === "medium") {
      return "bg-amber-50 text-amber-700 border-amber-200";
    }

    return "bg-blue-50 text-blue-700 border-blue-200";
  }

  function getLogoStatusStyle(status: string) {
    if (status.toLowerCase().includes("match")) {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }

    if (
      status.toLowerCase().includes("not verified") ||
      status.toLowerCase().includes("not match")
    ) {
      return "bg-red-50 text-red-700 border-red-200";
    }

    return "bg-amber-50 text-amber-700 border-amber-200";
  }

  const score = analysisResult?.compliance_score ?? 0;

  return (
    <main className="flex min-h-screen bg-[#F4EDE0] text-[#14213D]">

      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col bg-[#14213D] px-5 py-7 text-white md:flex">

        <Link href="/dashboard" className="flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF6B5B]">
            <ShieldCheck size={24} />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight">
              BrandGuard<span className="text-[#FF6B5B]">AI</span>
            </h1>
            <p className="text-[9px] tracking-[2px] text-slate-400">
              BRAND GOVERNANCE
            </p>
          </div>
        </Link>

        <div className="mt-12">
          <p className="mb-4 px-3 text-[10px] font-bold tracking-[2px] text-slate-500">
            WORKSPACE
          </p>

          <nav className="space-y-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <LayoutDashboard size={18} />
              Overview
            </Link>

            <Link
              href="/guidelines"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <BookOpen size={18} />
              Brand Guidelines
            </Link>

            <Link
              href="/review"
              className="flex items-center gap-3 rounded-xl bg-[#FF6B5B] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-black/10"
            >
              <FileSearch size={18} />
              Content Review
            </Link>

            <Link
              href="/reports"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <ClipboardList size={18} />
              Reports
            </Link>
          </nav>
        </div>

        <div className="mt-auto border-t border-white/10 pt-5">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <Globe size={18} />
            Back to Website
          </Link>

          <p className="mt-5 px-4 text-[10px] text-slate-500">
            AI-POWERED BRAND PROTECTION
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <section className="min-w-0 flex-1 px-5 py-7 sm:px-8 lg:px-12">

        {/* Header */}
        <header className="flex flex-col justify-between gap-5 border-b border-[#E5DED2] pb-7 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold tracking-[1.5px] text-[#FF6B5B]">
              <FileSearch size={15} />
              WORKSPACE / CONTENT REVIEW
            </div>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Content Review
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-[#687386]">
              Upload your documents and let BrandGuard AI examine them
              against your organisation's brand guidelines.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start rounded-full border border-[#E5DED2] bg-white px-4 py-2 text-xs font-medium text-[#687386] sm:self-center">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Analysis Workspace
          </div>
        </header>

        <div className="mx-auto mt-8 max-w-5xl space-y-7">

          {/* Intro Banner */}
          <div className="flex items-start gap-4 rounded-2xl bg-[#14213D] p-5 text-white shadow-sm sm:p-6">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#FF6B5B]">
              <Sparkles size={24} />
            </div>

            <div>
              <h3 className="font-semibold">
                Review before you publish.
              </h3>
              <p className="mt-1 text-sm leading-6 text-slate-300">
                Check content against your brand rules, identify potential
                issues and review suggested corrections before publication.
              </p>
            </div>
          </div>

          {/* Upload Card */}
          <div className="rounded-2xl border border-[#E5DED2] bg-white p-6 shadow-sm sm:p-8">

            <div className="mb-6 flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FFF0ED] text-[#FF6B5B]">
                <UploadCloud size={23} />
              </div>

              <div>
                <p className="text-xs font-bold tracking-widest text-[#FF6B5B]">
                  STEP 01 / UPLOAD
                </p>
                <h3 className="mt-1 text-xl font-bold">
                  Upload Your Document
                </h3>
                <p className="mt-1 text-sm text-[#687386]">
                  Select a document you want BrandGuard AI to review.
                </p>
              </div>
            </div>

            {/* Dropzone */}
            <label
              htmlFor="document"
              className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-5 py-12 text-center transition ${
                file
                  ? "border-[#FF6B5B] bg-[#FFF7F4]"
                  : "border-[#D8D1C5] bg-[#FAF8F4] hover:border-[#FF6B5B] hover:bg-[#FFF7F4]"
              } ${uploading ? "pointer-events-none opacity-60" : ""}`}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-[#FF6B5B] shadow-sm">
                <UploadCloud size={32} />
              </div>

              <span className="mt-5 text-lg font-bold">
                Click to upload your document
              </span>

              <span className="mt-2 text-sm text-[#687386]">
                Choose a PDF or DOCX file from your computer
              </span>

              <span className="mt-5 rounded-xl bg-[#14213D] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#24385E]">
                Browse Files
              </span>

              <input
                ref={fileInputRef}
                id="document"
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileChange}
                className="hidden"
                disabled={uploading}
              />
            </label>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-[#687386]">
              <span className="flex items-center gap-1.5">
                <FileText size={14} />
                PDF Documents
              </span>
              <span className="text-[#D8D1C5]">|</span>
              <span className="flex items-center gap-1.5">
                <FileCheck size={14} />
                DOCX Documents
              </span>
            </div>

            {/* Selected File */}
            {file && (
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#F4C7BE] bg-[#FFF7F4] p-4">

                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#FF6B5B]">
                    <FileText size={22} />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#14213D]">
                      {file.name}
                    </p>
                    <p className="mt-1 text-xs text-[#687386]">
                      {(file.size / 1024).toFixed(2)} KB · Ready for review
                    </p>
                  </div>
                </div>

                <button
                  onClick={removeFile}
                  disabled={uploading}
                  className="flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                >
                  <X size={15} />
                  Remove
                </button>
              </div>
            )}

            {/* Analyse Button */}
            <button
              onClick={handleReview}
              disabled={uploading || !file}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF6B5B] px-6 py-4 text-sm font-bold text-white shadow-md shadow-[#FF6B5B]/20 transition hover:bg-[#ed5b4c] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <Loader2 size={19} className="animate-spin" />
                  Uploading & Analysing...
                </>
              ) : (
                <>
                  <Search size={19} />
                  Analyse Document
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            {/* Status Message */}
            {message && (
              <div
                className={`mt-5 flex items-start gap-3 rounded-xl border p-4 text-sm ${
                  messageType === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : messageType === "error"
                    ? "border-red-200 bg-red-50 text-red-700"
                    : "border-blue-200 bg-blue-50 text-blue-700"
                }`}
              >
                {messageType === "success" ? (
                  <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
                ) : messageType === "error" ? (
                  <AlertCircle size={19} className="mt-0.5 shrink-0" />
                ) : (
                  <Loader2 size={19} className="mt-0.5 shrink-0 animate-spin" />
                )}

                <span>{message}</span>
              </div>
            )}
          </div>

          {/* Analysis Results */}
          {analysisResult && (
            <div className="space-y-6">

              {/* Report Heading */}
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <p className="text-xs font-bold tracking-widest text-[#FF6B5B]">
                    STEP 02 / RESULTS
                  </p>
                  <h3 className="mt-1 text-2xl font-bold">
                    Analysis Report
                  </h3>
                  <p className="mt-1 text-sm text-[#687386]">
                    Your document's brand compliance results.
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 size={15} />
                  Analysis Complete
                </div>
              </div>

              {/* Document Information */}
              <div className="rounded-2xl border border-[#E5DED2] bg-white p-5 shadow-sm sm:p-6">
                <p className="text-xs font-bold tracking-widest text-[#687386]">
                  DOCUMENT DETAILS
                </p>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF0ED] text-[#FF6B5B]">
                      <FileText size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-[#89909B]">Filename</p>
                      <p className="truncate text-sm font-semibold">
                        {analysisResult.filename}
                      </p>
                    </div>
                  </div>

                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F4EDE0] text-[#14213D]">
                      <ShieldCheck size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-[#89909B]">Organisation</p>
                      <p className="truncate text-sm font-semibold">
                        {analysisResult.company_name || "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Score Cards */}
              <div className="grid gap-5 sm:grid-cols-2">

                <div className="rounded-2xl border border-[#E5DED2] bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-[#687386]">
                      Compliance Score
                    </p>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <ShieldCheck size={21} />
                    </div>
                  </div>

                  <p className={`mt-4 text-4xl font-bold ${
                    score >= 80
                      ? "text-emerald-600"
                      : score >= 50
                      ? "text-amber-600"
                      : "text-red-500"
                  }`}>
                    {score}%
                  </p>

                  <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-[#F0EDE7]">
                    <div
                      className={`h-full rounded-full transition-all ${
                        score >= 80
                          ? "bg-emerald-500"
                          : score >= 50
                          ? "bg-amber-500"
                          : "bg-red-500"
                      }`}
                      style={{
                        width: `${Math.max(0, Math.min(100, score))}%`,
                      }}
                    />
                  </div>

                  <p className="mt-3 text-xs text-[#89909B]">
                    Based on the completed analysis.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#E5DED2] bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-[#687386]">
                      Total Issues Found
                    </p>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF0ED] text-[#FF6B5B]">
                      <AlertTriangle size={21} />
                    </div>
                  </div>

                  <p className="mt-4 text-4xl font-bold text-[#FF6B5B]">
                    {analysisResult.total_issues}
                  </p>

                  <p className="mt-3 text-xs text-[#89909B]">
                    Issues identified during document review.
                  </p>
                </div>
              </div>

              {/* Detected Issues */}
              <div className="rounded-2xl border border-[#E5DED2] bg-white p-6 shadow-sm sm:p-8">

                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold tracking-widest text-[#FF6B5B]">
                      CONTENT CHECK
                    </p>
                    <h3 className="mt-1 text-xl font-bold">
                      Detected Issues
                    </h3>
                  </div>

                  <div className="rounded-lg bg-[#FFF0ED] px-3 py-2 text-sm font-bold text-[#FF6B5B]">
                    {analysisResult.issues.length} found
                  </div>
                </div>

                {analysisResult.issues.length === 0 ? (
                  <div className="mt-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-700">
                    <CheckCircle2 size={22} className="mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold">
                        No issues detected!
                      </p>
                      <p className="mt-1 text-sm">
                        Your document passed the current checks. This does
                        not necessarily guarantee that every brand requirement
                        has been satisfied.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 space-y-4">
                    {analysisResult.issues.map((issue, index) => (
                      <div
                        key={index}
                        className="rounded-xl border border-[#E5DED2] bg-[#FAF8F4] p-5"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#FF6B5B]">
                              <AlertTriangle size={17} />
                            </div>
                            <h4 className="font-bold">
                              {issue.type}
                            </h4>
                          </div>

                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-bold ${getSeverityStyle(issue.severity)}`}
                          >
                            {issue.severity} Severity
                          </span>
                        </div>

                        {issue.word && (
                          <div className="mt-4 inline-flex rounded-lg border border-[#E5DED2] bg-white px-3 py-2 text-xs text-[#687386]">
                            Detected term:
                            <span className="ml-1 font-bold text-[#14213D]">
                              {issue.word}
                            </span>
                          </div>
                        )}

                        <p className="mt-4 text-sm leading-6 text-[#536075]">
                          {issue.message}
                        </p>

                        {issue.position !== undefined && (
                          <p className="mt-2 text-xs text-[#89909B]">
                            Text position: {issue.position}
                          </p>
                        )}

                        <div className="mt-4 rounded-xl border border-[#F4C7BE] bg-[#FFF7F4] p-4">
                          <div className="flex items-center gap-2 text-xs font-bold tracking-wide text-[#D95749]">
                            <Lightbulb size={15} />
                            SUGGESTED CORRECTION
                          </div>

                          <p className="mt-2 text-sm leading-6 text-[#536075]">
                            {issue.suggestion}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Logo Verification */}
              <div className="rounded-2xl border border-[#E5DED2] bg-white p-6 shadow-sm sm:p-8">

                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FFF0ED] text-[#FF6B5B]">
                    <ImageIcon size={22} />
                  </div>

                  <div>
                    <p className="text-xs font-bold tracking-widest text-[#FF6B5B]">
                      VISUAL CHECK
                    </p>
                    <h3 className="mt-1 text-xl font-bold">
                      Logo Verification
                    </h3>
                    <p className="mt-1 text-sm text-[#687386]">
                      Comparison with the approved reference logo.
                    </p>
                  </div>
                </div>

                {!analysisResult.logo_analysis ||
                analysisResult.logo_analysis.length === 0 ? (
                  <div className="mt-6 rounded-xl bg-[#FAF8F4] p-5 text-sm text-[#687386]">
                    No images were available for logo verification.
                  </div>
                ) : (
                  <div className="mt-6 space-y-4">
                    {analysisResult.logo_analysis.map((logo, index) => (
                      <div
                        key={logo.image_id ?? index}
                        className="rounded-xl border border-[#E5DED2] bg-[#FAF8F4] p-5"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <h4 className="font-bold">
                            Image {index + 1}
                          </h4>

                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-bold ${getLogoStatusStyle(logo.status)}`}
                          >
                            {logo.status}
                          </span>
                        </div>

                        <p className="mt-3 text-sm leading-6 text-[#536075]">
                          {logo.message}
                        </p>

                        <div className="mt-5 grid gap-3 sm:grid-cols-3">
                          <div className="rounded-xl border border-[#E5DED2] bg-white p-4">
                            <p className="text-xs text-[#89909B]">
                              Matching Features
                            </p>
                            <p className="mt-2 text-2xl font-bold text-[#14213D]">
                              {logo.matching_features}
                            </p>
                          </div>

                          <div className="rounded-xl border border-[#E5DED2] bg-white p-4">
                            <p className="text-xs text-[#89909B]">
                              Geometric Inliers
                            </p>
                            <p className="mt-2 text-2xl font-bold text-[#14213D]">
                              {logo.geometric_inliers}
                            </p>
                          </div>

                          <div className="rounded-xl border border-[#E5DED2] bg-white p-4">
                            <p className="text-xs text-[#89909B]">
                              Match Ratio
                            </p>
                            <p className="mt-2 text-2xl font-bold text-[#14213D]">
                              {logo.inlier_ratio !== undefined
                                ? `${(logo.inlier_ratio * 100).toFixed(1)}%`
                                : "N/A"}
                            </p>
                          </div>
                        </div>

                        {logo.page_number !== null && (
                          <p className="mt-4 text-xs text-[#89909B]">
                            Page Number: {logo.page_number}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-5 flex items-start gap-2 rounded-xl bg-[#FAF8F4] p-4 text-xs leading-5 text-[#687386]">
                  <ShieldAlert size={16} className="mt-0.5 shrink-0" />
                  Logo verification uses visual feature matching. Results
                  are indicative and should be reviewed before final approval.
                </div>
              </div>

              {/* Human Review Notice */}
              <div className="flex items-start gap-3 rounded-2xl border border-[#E5DED2] bg-white p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F4EDE0] text-[#14213D]">
                  <CheckCircle2 size={21} />
                </div>

                <div>
                  <h4 className="font-bold">
                    Final Human Review
                  </h4>
                  <p className="mt-1 text-sm leading-6 text-[#687386]">
                    AI-generated findings are intended to assist your review.
                    A human reviewer should verify the issues and approve
                    content before publication.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* What Will Be Checked */}
          {!analysisResult && (
            <>
              <div>
                <p className="text-xs font-bold tracking-widest text-[#FF6B5B]">
                  BRAND PROTECTION
                </p>

                <h3 className="mt-1 text-xl font-bold">
                  What Will Be Checked?
                </h3>

                <p className="mt-2 text-sm text-[#687386]">
                  BrandGuard AI helps examine your content across these areas.
                </p>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">

                  <div className="rounded-2xl border border-[#E5DED2] bg-white p-5 shadow-sm">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF0ED] text-[#FF6B5B]">
                      <MessageSquareIcon />
                    </div>
                    <h4 className="mt-4 font-bold">Tone Consistency</h4>
                    <p className="mt-2 text-sm leading-6 text-[#687386]">
                      Checks whether the writing style aligns with your
                      approved brand voice.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#E5DED2] bg-white p-5 shadow-sm">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <CheckCircle2 size={21} />
                    </div>
                    <h4 className="mt-4 font-bold">Terminology</h4>
                    <p className="mt-2 text-sm leading-6 text-[#687386]">
                      Identifies restricted words and terminology that
                      conflicts with your brand rules.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#E5DED2] bg-white p-5 shadow-sm">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                      <Search size={21} />
                    </div>
                    <h4 className="mt-4 font-bold">Promotional Claims</h4>
                    <p className="mt-2 text-sm leading-6 text-[#687386]">
                      Flags potentially unsupported or exaggerated
                      promotional claims for review.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#E5DED2] bg-white p-5 shadow-sm">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Palette size={21} />
                    </div>
                    <h4 className="mt-4 font-bold">Visual Compliance</h4>
                    <p className="mt-2 text-sm leading-6 text-[#687386]">
                      Examines available visual elements, brand colours
                      and logo consistency.
                    </p>
                  </div>
                </div>
              </div>

              {/* Workflow */}
              <div className="rounded-2xl border border-[#E5DED2] bg-white p-6 shadow-sm sm:p-7">
                <h3 className="text-lg font-bold">
                  How the Review Works
                </h3>

                <div className="mt-6 grid gap-5 sm:grid-cols-4">
                  {[
                    { number: "01", title: "Upload", detail: "Select a PDF or DOCX document." },
                    { number: "02", title: "Analyse", detail: "AI checks your brand rules." },
                    { number: "03", title: "Review", detail: "Examine detected issues." },
                    { number: "04", title: "Approve", detail: "Human reviewer makes the final decision." },
                  ].map((step) => (
                    <div key={step.number}>
                      <p className="text-sm font-bold text-[#FF6B5B]">
                        {step.number}
                      </p>
                      <h4 className="mt-2 font-bold">{step.title}</h4>
                      <p className="mt-1 text-xs leading-5 text-[#687386]">
                        {step.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <p className="pb-5 text-center text-xs text-[#89909B]">
            BrandGuard AI · Protecting consistency. Preserving identity.
          </p>
        </div>
      </section>
    </main>
  );
}

function MessageSquareIcon() {
  return <FileSearch size={21} />;
}
