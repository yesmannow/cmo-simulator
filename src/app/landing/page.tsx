"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardList,
  LineChart,
  Play,
  ShieldCheck,
  Target,
  Users,
  X,
} from "lucide-react";
import { MobileInstallPrompt } from "@/components/simulation/MobileInstallPrompt";
import HeroVisual from "@/components/ui/HeroVisual";

const proofPoints = [
  {
    icon: BriefcaseBusiness,
    title: "Executive Pressure",
    text: "Players balance CEO urgency, CFO scrutiny, sales alignment, brand health, and market share in one quarterly operating loop.",
  },
  {
    icon: BarChart3,
    title: "Decision Consequences",
    text: "Every move changes revenue, profit, customer satisfaction, team morale, and future quarter flexibility.",
  },
  {
    icon: ClipboardList,
    title: "Useful Debrief",
    text: "Each run ends with a teaching report, leadership archetype, turning point, and recommended next experiment.",
  },
];

const operatorUses = [
  "Warm up a founder or owner before a real marketing strategy conversation.",
  "Show how Darling MarTech thinks through tradeoffs, budget, and execution risk.",
  "Create a shareable assessment moment that feels more valuable than a static lead magnet.",
];

const previewRows = [
  ["Q1", "Positioning reset", "+8.4% trust", "Board confidence stable"],
  ["Q2", "Demand capture", "+$186k revenue", "CAC pressure rising"],
  ["Q3", "Retention sprint", "+5.2% margin", "Team load elevated"],
  ["Q4", "Category push", "+3.1% share", "High replay value"],
];

export default function LandingPage() {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <HeroVisual />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.72),rgba(2,6,23,0.94)_62%,#f8fafc_62%)]" />

      <section className="relative z-10 mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-center px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/8 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-200 backdrop-blur">
            <ShieldCheck className="h-4 w-4 text-emerald-300" />
            Executive marketing simulation
          </div>

          <h1 className="max-w-4xl text-5xl font-semibold leading-[0.98] tracking-tight text-white sm:text-6xl lg:text-7xl">
            CMO Simulator
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200 sm:text-xl">
            A playable marketing strategy lab for business owners and growth leaders. Run a simulated year, make budget calls under pressure, and leave with a briefing that explains what your decisions reveal.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/sim/setup"
              className="inline-flex items-center justify-center rounded-md bg-white px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-black/20 transition hover:bg-slate-100"
            >
              Start the simulation
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="inline-flex items-center justify-center rounded-md border border-white/15 bg-slate-950/55 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-slate-900"
            >
              <Play className="mr-2 h-4 w-4" />
              View sample debrief
            </button>
          </div>

          <MobileInstallPrompt className="mt-4 max-w-md md:hidden" />
        </motion.div>

        <div className="mt-14 grid max-w-5xl grid-cols-1 gap-3 md:grid-cols-3">
          {proofPoints.map((point, index) => (
            <motion.article
              key={point.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index + 0.35, duration: 0.5 }}
              className="rounded-lg border border-white/10 bg-slate-950/58 p-5 backdrop-blur"
            >
              <point.icon className="h-5 w-5 text-emerald-300" />
              <h2 className="mt-4 text-base font-semibold text-white">{point.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">{point.text}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="relative z-10 bg-slate-50 px-4 py-14 text-slate-950 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Built to drive better conversations</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">The next step is making the tool prove expertise before a sales call.</h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              The simulator should function as both a valuable visitor experience and a diagnostic entry point. It demonstrates strategic judgment, creates a reason to share contact details, and gives Darling MarTech a stronger follow-up artifact than a generic consultation request.
            </p>
            <div className="mt-8 space-y-3">
              {operatorUses.map((use) => (
                <div key={use} className="flex gap-3 text-sm leading-6 text-slate-700">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                  <span>{use}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Sample output</p>
                <h3 className="mt-1 text-xl font-semibold">Executive debrief snapshot</h3>
              </div>
              <span className="rounded-md bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">Lead asset ready</span>
            </div>
            <div className="mt-5 overflow-hidden rounded-lg border border-slate-200">
              <div className="grid grid-cols-[64px_1fr_1fr_1fr] bg-slate-100 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <span>Qtr</span>
                <span>Move</span>
                <span>Signal</span>
                <span>Risk</span>
              </div>
              {previewRows.map((row) => (
                <div key={row[0]} className="grid grid-cols-[64px_1fr_1fr_1fr] border-t border-slate-200 px-4 py-4 text-sm text-slate-700">
                  <span className="font-semibold text-slate-950">{row[0]}</span>
                  <span>{row[1]}</span>
                  <span>{row[2]}</span>
                  <span>{row[3]}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <Metric icon={Target} label="Strategic fit" value="86/100" />
              <Metric icon={LineChart} label="Market lift" value="+14.2%" />
              <Metric icon={Users} label="Follow-up hook" value="Report" />
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <button
              type="button"
              aria-label="Close sample debrief"
              className="absolute inset-0 bg-slate-950/82 backdrop-blur-md"
              onClick={() => setShowPreview(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-3xl rounded-lg border border-white/10 bg-slate-950 p-6 shadow-2xl"
            >
              <button
                type="button"
                aria-label="Close sample debrief"
                onClick={() => setShowPreview(false)}
                className="absolute right-4 top-4 rounded-md border border-white/10 bg-white/5 p-2 text-slate-300 hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-300">Sample debrief</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">What a completed run gives the visitor</h2>
              <div className="mt-6 grid gap-3 md:grid-cols-2">
                {[
                  ["Outcome", "Finished with 21.6% market share and a profitable Q4 after pressure from rising acquisition costs."],
                  ["Why", "Brand and retention investments made late-quarter revenue more durable than pure paid demand capture."],
                  ["Tradeoff", "The plan created stronger trust, but left less budget flexibility when competitive pressure increased."],
                  ["Next move", "Replay with a tighter Q2 demand plan and reserve 15% for retention before scaling acquisition."],
                ].map(([label, text]) => (
                  <div key={label} className="rounded-lg border border-white/10 bg-white/5 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-100">{text}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link href="/sim/setup" className="inline-flex items-center justify-center rounded-md bg-white px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-slate-100">
                  Run your version
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => setShowPreview(false)}
                  className="inline-flex items-center justify-center rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10"
                >
                  Back to overview
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof Target; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <Icon className="h-4 w-4 text-slate-500" />
      <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-slate-950">{value}</p>
    </div>
  );
}
