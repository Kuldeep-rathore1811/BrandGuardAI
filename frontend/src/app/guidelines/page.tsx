
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  LayoutDashboard,
  BookOpen,
  FileSearch,
  ClipboardList,
  Globe,
  Building2,
  MessageSquare,
  CheckCircle2,
  Ban,
  Palette,
  Save,
  ArrowLeft,
  Loader2,
  AlertCircle,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function Guidelines() {
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");
  const [tone, setTone] = useState("Professional");
  const [approved, setApproved] = useState("");
  const [restricted, setRestricted] = useState("");
  const [visualRules, setVisualRules] = useState("");

  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [guidelineId, setGuidelineId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchGuidelines() {
      try {
        const response = await fetch(`${API_BASE}/guidelines`);

        if (!response.ok) {
          throw new Error("Failed to load guidelines");
        }

        const data = await response.json();

        if (data.length > 0) {
          const latest = data[0];

          setGuidelineId(latest.id);
          setCompany(latest.company_name || "");
          setDescription(latest.brand_description || "");
          setTone(latest.brand_tone || "Professional");
          setApproved(latest.approved_terminology || "");
          setRestricted(latest.restricted_terminology || "");
          setVisualRules(latest.visual_guidelines || "");
        }
      } catch (err) {
        console.error("Error fetching guidelines:", err);
        setError("Unable to load saved guidelines. Check that your backend is running.");
      } finally {
        setLoading(false);
      }
    }

    fetchGuidelines();
  }, []);

  function markChanged() {
    setSaved(false);
    setError("");
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    setError("");

    try {
      const url = guidelineId
        ? `${API_BASE}/guidelines/${guidelineId}`
        : `${API_BASE}/guidelines`;

      const response = await fetch(url, {
        method: guidelineId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_name: company,
          brand_description: description,
          brand_tone: tone,
          approved_terminology: approved,
          restricted_terminology: restricted,
          visual_guidelines: visualRules,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to save guidelines");
      }

      if (!guidelineId) {
        setGuidelineId(data.guideline_id);
      }

      setSaved(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  }

  const sections = [
    { number: "01", title: "Brand Identity", description: "Your organisation's basic information.", icon: Building2 },
    { number: "02", title: "Tone of Voice", description: "How your brand communicates.", icon: MessageSquare },
    { number: "03", title: "Approved Terminology", description: "Words and phrases your brand prefers.", icon: CheckCircle2 },
    { number: "04", title: "Restricted Terminology", description: "Words and claims your brand should avoid.", icon: Ban },
    { number: "05", title: "Visual Guidelines", description: "Your brand colours, logo and visual identity.", icon: Palette },
  ];

  const inputClass =
    "mt-2 w-full rounded-xl border border-[#E5DED2] bg-[#FAF8F4] px-4 py-3 text-sm text-[#14213D] outline-none transition placeholder:text-[#9AA1AC] focus:border-[#FF6B5B] focus:ring-2 focus:ring-[#FF6B5B]/10";

  const labelClass = "text-sm font-semibold text-[#14213D]";

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
            <Link href="/dashboard" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white">
              <LayoutDashboard size={18} />
              Overview
            </Link>

            <Link href="/guidelines" className="flex items-center gap-3 rounded-xl bg-[#FF6B5B] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-black/10">
              <BookOpen size={18} />
              Brand Guidelines
            </Link>

            <Link href="/review" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white">
              <FileSearch size={18} />
              Content Review
            </Link>

            <Link href="/reports" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white">
              <ClipboardList size={18} />
              Reports
            </Link>
          </nav>
        </div>

        <div className="mt-auto border-t border-white/10 pt-5">
          <Link href="/" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white">
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
              <BookOpen size={15} />
              WORKSPACE / BRAND GUIDELINES
            </div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Brand Guidelines
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#687386]">
              Define your brand identity, communication style and visual rules.
              BrandGuard AI uses these guidelines to review your content.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start rounded-full border border-[#E5DED2] bg-white px-4 py-2 text-xs font-medium text-[#687386] sm:self-center">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Guidelines Workspace
          </div>
        </header>

        <div className="mx-auto mt-8 max-w-4xl space-y-6">

          {/* Intro Card */}
          <div className="flex items-start gap-4 rounded-2xl bg-[#14213D] p-5 text-white shadow-sm sm:p-6">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#FF6B5B]">
              <ShieldCheck size={25} />
            </div>
            <div>
              <h3 className="font-semibold">Your brand. Your rules.</h3>
              <p className="mt-1 text-sm leading-6 text-slate-300">
                Set your organisation's standards once. Use them as the reference
                for checking content consistency and brand compliance.
              </p>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex items-center gap-3 rounded-xl border border-[#E5DED2] bg-white p-5 text-sm text-[#687386]">
              <Loader2 size={18} className="animate-spin text-[#FF6B5B]" />
              Loading your saved guidelines...
            </div>
          )}

          {/* Section 1: Brand Identity */}
          <div className="rounded-2xl border border-[#E5DED2] bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FFF0ED] text-[#FF6B5B]">
                <Building2 size={22} />
              </div>
              <div>
                <p className="text-xs font-bold tracking-widest text-[#FF6B5B]">01 / BRAND IDENTITY</p>
                <h3 className="mt-1 text-xl font-bold">Brand Identity</h3>
                <p className="mt-1 text-sm text-[#687386]">Basic information about your organisation.</p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className={labelClass}>Company / Organisation Name</label>
                <input
                  value={company}
                  onChange={(e) => {
                    setCompany(e.target.value);
                    markChanged();
                  }}
                  placeholder="e.g. BrandGuard Technologies"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Brand Description</label>
                <textarea
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    markChanged();
                  }}
                  placeholder="Describe your organisation, products, services and brand identity..."
                  rows={4}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Tone of Voice */}
          <div className="rounded-2xl border border-[#E5DED2] bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FFF0ED] text-[#FF6B5B]">
                <MessageSquare size={22} />
              </div>
              <div>
                <p className="text-xs font-bold tracking-widest text-[#FF6B5B]">02 / COMMUNICATION</p>
                <h3 className="mt-1 text-xl font-bold">Tone of Voice</h3>
                <p className="mt-1 text-sm text-[#687386]">Choose how your brand should communicate.</p>
              </div>
            </div>

            <label className={labelClass}>Preferred Communication Tone</label>
            <select
              value={tone}
              onChange={(e) => {
                setTone(e.target.value);
                markChanged();
              }}
              className={inputClass}
            >
              <option>Professional</option>
              <option>Friendly</option>
              <option>Formal</option>
              <option>Conversational</option>
              <option>Innovative</option>
            </select>

            <p className="mt-3 text-xs text-[#687386]">
              Choose the tone that best represents your organisation.
            </p>
          </div>

          {/* Section 3: Approved Terminology */}
          <div className="rounded-2xl border border-[#E5DED2] bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 size={22} />
              </div>
              <div>
                <p className="text-xs font-bold tracking-widest text-[#FF6B5B]">03 / PREFERRED WORDS</p>
                <h3 className="mt-1 text-xl font-bold">Approved Terminology</h3>
                <p className="mt-1 text-sm text-[#687386]">Words and phrases your organisation prefers.</p>
              </div>
            </div>

            <label className={labelClass}>Approved Words & Phrases</label>
            <textarea
              value={approved}
              onChange={(e) => {
                setApproved(e.target.value);
                markChanged();
              }}
              placeholder="Example: Customer Success, Brand Partner, Official Product Name..."
              rows={4}
              className={inputClass}
            />
            <p className="mt-2 text-xs text-[#687386]">
              Separate multiple words or phrases with commas.
            </p>
          </div>

          {/* Section 4: Restricted Terminology */}
          <div className="rounded-2xl border border-[#E5DED2] bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500">
                <Ban size={22} />
              </div>
              <div>
                <p className="text-xs font-bold tracking-widest text-[#FF6B5B]">04 / RESTRICTED WORDS</p>
                <h3 className="mt-1 text-xl font-bold">Restricted Terminology</h3>
                <p className="mt-1 text-sm text-[#687386]">Words or claims that should be avoided.</p>
              </div>
            </div>

            <label className={labelClass}>Restricted Words & Phrases</label>
            <textarea
              value={restricted}
              onChange={(e) => {
                setRestricted(e.target.value);
                markChanged();
              }}
              placeholder="Example: Guaranteed Results, 100% Risk-Free, Unapproved Claims..."
              rows={4}
              className={inputClass}
            />
            <p className="mt-2 text-xs text-[#687386]">
              Add terminology that does not align with your brand standards.
            </p>
          </div>

          {/* Section 5: Visual Guidelines */}
          <div className="rounded-2xl border border-[#E5DED2] bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FFF0ED] text-[#FF6B5B]">
                <Palette size={22} />
              </div>
              <div>
                <p className="text-xs font-bold tracking-widest text-[#FF6B5B]">05 / VISUAL IDENTITY</p>
                <h3 className="mt-1 text-xl font-bold">Visual Guidelines</h3>
                <p className="mt-1 text-sm text-[#687386]">Define your brand colours, logo and visual rules.</p>
              </div>
            </div>

            <label className={labelClass}>Brand Colours & Visual Requirements</label>
            <textarea
              value={visualRules}
              onChange={(e) => {
                setVisualRules(e.target.value);
                markChanged();
              }}
              placeholder="Example: Primary colour navy blue (#000080). Secondary colour white (#FFFFFF). Use the official logo and maintain clear spacing around it."
              rows={5}
              className={inputClass}
            />

            <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl bg-[#FAF8F4] p-4">
              <span className="text-xs font-semibold text-[#687386]">Brand palette example:</span>
              <div className="flex items-center gap-2">
                <span className="h-6 w-6 rounded-full border border-black/10 bg-[#14213D]" />
                <span className="text-xs text-[#687386]">Navy</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-6 w-6 rounded-full border border-black/10 bg-[#F4EDE0]" />
                <span className="text-xs text-[#687386]">Cream</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-6 w-6 rounded-full border border-black/10 bg-[#FF6B5B]" />
                <span className="text-xs text-[#687386]">Coral</span>
              </div>
            </div>
          </div>

          {/* Save Area */}
          <div className="rounded-2xl border border-[#E5DED2] bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-bold">Ready to save your guidelines?</h3>
                <p className="mt-1 text-sm text-[#687386]">
                  Your rules will be stored and used during content analysis.
                </p>
              </div>

              <button
                onClick={handleSave}
                disabled={saving || loading}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#FF6B5B] px-7 py-3.5 text-sm font-bold text-white shadow-md shadow-[#FF6B5B]/20 transition hover:bg-[#ed5b4c] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Guidelines
                  </>
                )}
              </button>
            </div>

            {saved && (
              <div className="mt-5 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
                <CheckCircle2 size={20} />
                Guidelines saved successfully!
              </div>
            )}

            {error && (
              <div className="mt-5 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <AlertCircle size={20} />
                {error}
              </div>
            )}

            {!saved && !error && (
              <p className="mt-4 flex items-center gap-2 text-xs text-[#687386]">
                <ArrowLeft size={14} />
                You can update these guidelines whenever your brand rules change.
              </p>
            )}
          </div>

          <p className="pb-5 text-center text-xs text-[#89909B]">
            BrandGuard AI · Protecting consistency. Preserving identity.
          </p>
        </div>
      </section>
    </main>
  );
}
