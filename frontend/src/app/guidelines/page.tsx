
"use client";

import { useEffect, useState } from "react";

export default function Guidelines() {
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");
  const [tone, setTone] = useState("Professional");
  const [approved, setApproved] = useState("");
  const [restricted, setRestricted] = useState("");
  const [visualRules, setVisualRules] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [guidelineId, setGuidelineId] = useState<number | null>(null);

useEffect(() => {
  async function fetchGuidelines() {
    try {
      const response = await fetch(
        "https://brandguardai-jgyc.onrender.com/guidelines"
      );

      if (!response.ok) {
        throw new Error("Failed to load guidelines");
      }

      const data = await response.json();

      // Get the latest saved record
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
      setError("Unable to load saved guidelines.");
    }
  }

  fetchGuidelines();
}, []);

  async function handleSave() {
  setSaving(true);
  setSaved(false);
  setError("");

  try {
    const url = guidelineId
      ? `https://brandguardai-jgyc.onrender.com/guidelines/${guidelineId}`
      : "https://brandguardai-jgyc.onrender.com/guidelines";

    const method = guidelineId ? "PUT" : "POST";

    const response = await fetch(url, {
      method: method,
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

  return (
    <main className="min-h-screen bg-slate-950 text-white flex">

      {/* Sidebar */}
      <aside className="hidden w-64 border-r border-slate-800 bg-slate-900 p-6 md:block">
        <h1 className="text-2xl font-bold">
          BrandGuard<span className="text-blue-400">AI</span>
        </h1>

        <p className="mt-2 text-xs text-slate-500">
          BRAND GOVERNANCE PLATFORM
        </p>

        <nav className="mt-12 space-y-3">
          <a href="/dashboard" className="block rounded-lg px-4 py-3 text-slate-400 hover:bg-slate-800">
            Overview
          </a>

          <a href="/guidelines" className="block rounded-lg bg-blue-600 px-4 py-3 font-medium">
            Brand Guidelines
          </a>

          <a href="/review" className="block rounded-lg px-4 py-3 text-slate-400 hover:bg-slate-800">
            Content Review
          </a>

          <a href="/reports" className="block rounded-lg px-4 py-3 text-slate-400 hover:bg-slate-800">
            Reports
          </a>

          <a href="/" className="block rounded-lg px-4 py-3 text-slate-400 hover:bg-slate-800">
            Back to Website
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <section className="flex-1 p-6 md:p-10">

        <header className="border-b border-slate-800 pb-6">
          <p className="text-sm text-blue-400">WORKSPACE / BRAND GUIDELINES</p>
          <h2 className="mt-2 text-3xl font-bold">Brand Guidelines</h2>
          <p className="mt-2 text-slate-400">
            Define the rules that your organisation wants its content to follow.
          </p>
        </header>

        <div className="mx-auto mt-8 max-w-4xl space-y-8">

          {/* Brand Identity */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="text-xl font-semibold">01. Brand Identity</h3>
            <p className="mt-2 text-sm text-slate-400">
              Basic information about your organisation.
            </p>

            <label className="mt-6 block text-sm font-medium">
              Company / Organisation Name
            </label>
            <input
              value={company}
              onChange={(e) => {
                setCompany(e.target.value);
                setSaved(false);
              }}
              placeholder="Enter organisation name"
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-blue-500"
            />

            <label className="mt-5 block text-sm font-medium">
              Brand Description
            </label>
            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setSaved(false);
              }}
              placeholder="Describe your organisation and its brand identity..."
              rows={3}
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-blue-500"
            />
          </div>

          {/* Tone of Voice */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="text-xl font-semibold">02. Tone of Voice</h3>
            <p className="mt-2 text-sm text-slate-400">
              Select the communication style your brand should follow.
            </p>

            <label className="mt-6 block text-sm font-medium">
              Preferred Communication Tone
            </label>

            <select
              value={tone}
              onChange={(e) => {
                setTone(e.target.value);
                setSaved(false);
              }}
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-blue-500"
            >
              <option>Professional</option>
              <option>Friendly</option>
              <option>Formal</option>
              <option>Conversational</option>
              <option>Innovative</option>
            </select>
          </div>

          {/* Terminology */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="text-xl font-semibold">03. Approved Terminology</h3>
            <p className="mt-2 text-sm text-slate-400">
              Add words and phrases that your organisation prefers.
            </p>

            <textarea
              value={approved}
              onChange={(e) => {
                setApproved(e.target.value);
                setSaved(false);
              }}
              placeholder="Example: Customer Success, Brand Partner, Official Product Name"
              rows={4}
              className="mt-5 w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-blue-500"
            />
          </div>

          {/* Restricted Words */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="text-xl font-semibold">04. Restricted Terminology</h3>
            <p className="mt-2 text-sm text-slate-400">
              Add words or phrases that should be avoided.
            </p>

            <textarea
              value={restricted}
              onChange={(e) => {
                setRestricted(e.target.value);
                setSaved(false);
              }}
              placeholder="Example: Guaranteed Results, 100% Risk-Free, Unapproved Claims"
              rows={4}
              className="mt-5 w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-blue-500"
            />
          </div>

          {/* Visual Guidelines */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="text-xl font-semibold">05. Visual Guidelines</h3>
            <p className="mt-2 text-sm text-slate-400">
              Describe your brand colours, logo requirements and visual rules.
            </p>

            <textarea
              value={visualRules}
              onChange={(e) => {
                setVisualRules(e.target.value);
                setSaved(false);
              }}
              placeholder="Example: Primary colour #2563EB. Use the official logo. Maintain clear spacing around the logo."
              rows={4}
              className="mt-5 w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-blue-500"
            />
          </div>

          {/* Save Button */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-400">
              Review your rules before saving.
            </p>

            <button
              onClick={handleSave}
              className="rounded-lg bg-blue-600 px-8 py-3 font-semibold hover:bg-blue-500"
            >
              Save Guidelines
            </button>
          </div>

          {saved && (
            <div className="rounded-lg border border-green-700 bg-green-900/20 p-4 text-green-400">
              Guidelines captured successfully in this session!
            </div>
          )}

        </div>
      </section>
    </main>
  );
}
