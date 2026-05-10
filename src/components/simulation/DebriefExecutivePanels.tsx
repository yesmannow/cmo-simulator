"use client";

import type { SimulationContext } from "@/lib/simMachine";
import type { TeachingReport } from "@/lib/simulationInsights";
import {
  buildBenchmarkComparisonFromSimulationContext,
  mapSimulationIndustryToBenchmarkIndustry,
} from "@/lib/analytics/benchmarks";
import { BarChart3, FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";

function clampPct(value: number) {
  return Math.round(Math.min(99, Math.max(0, value)));
}

function PercentileRow({
  label,
  percentile,
  detail,
}: {
  label: string;
  percentile: number;
  detail: string;
}) {
  const p = clampPct(percentile);
  return (
    <div className="min-w-0">
      <div className="flex items-center justify-between gap-2 text-xs font-semibold text-slate-700">
        <span>{label}</span>
        <span className="shrink-0 tabular-nums text-slate-950">{p}th pct</span>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-slate-900 transition-[width] duration-500"
          style={{ width: `${p}%` }}
          aria-hidden
        />
      </div>
      <p className="mt-1 text-[11px] leading-snug text-slate-500">{detail}</p>
    </div>
  );
}

/** Percentile-style benchmark lens vs deterministic synthetic cohort tables (see `benchmarks.ts`). */
export function DebriefBenchmarkContextStrip({ context }: { context: SimulationContext }) {
  const bench = buildBenchmarkComparisonFromSimulationContext(context);
  const cohortIndustry = mapSimulationIndustryToBenchmarkIndustry(context.strategy.industry ?? "ecommerce");
  const cohortLabel =
    cohortIndustry === "healthcare"
      ? "Healthcare"
      : cohortIndustry === "legal"
        ? "Legal / regulated services"
        : "Digital commerce / SaaS proxy";

  const { componentComparison, yourPercentile } = bench;

  return (
    <section
      className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 shadow-sm sm:p-6"
      aria-labelledby="debrief-benchmark-heading"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-xl border border-slate-200 bg-white p-2.5">
            <BarChart3 className="h-5 w-5 text-slate-700" aria-hidden />
          </div>
          <div>
            <p id="debrief-benchmark-heading" className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Benchmark context
            </p>
            <h2 className="mt-1 text-lg font-semibold tracking-tight text-slate-950">
              Where this run sits vs a synthetic executive cohort
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
              Cohort: <span className="font-medium text-slate-800">{cohortLabel}</span> · difficulty{" "}
              <span className="font-medium capitalize text-slate-800">{context.strategy.difficulty ?? "intermediate"}</span>.
              Percentiles are
              illustrative — normalized to full-year totals and the simulator&apos;s rubric, not a live leaderboard.
            </p>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-right sm:shrink-0">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Composite tilt</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-slate-950">{clampPct(yourPercentile)}th</p>
          <p className="text-[11px] text-slate-500">Mapped teaching score</p>
        </div>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <PercentileRow
          label="Revenue mass"
          percentile={componentComparison.revenue.percentile}
          detail={`FY revenue vs cohort median benchmark.`}
        />
        <PercentileRow
          label="Profit efficiency (ROI proxy)"
          percentile={componentComparison.roi.percentile}
          detail={`Profit ÷ revenue vs modeled ROI bands.`}
        />
        <PercentileRow
          label="Market share exit"
          percentile={componentComparison.marketShare.percentile}
          detail={`Q4 share vs cohort distribution.`}
        />
        <PercentileRow
          label="Brand / satisfaction signal"
          percentile={componentComparison.brandEquity.percentile}
          detail={`Exit awareness & satisfaction blended into equity proxy.`}
        />
      </div>

      {(bench.strengths.length > 0 || bench.gaps.length > 0) && (
        <div className="mt-5 grid gap-3 border-t border-slate-200 pt-5 md:grid-cols-2">
          {bench.strengths.length > 0 ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-800">Relative strengths</p>
              <ul className="mt-2 space-y-1 text-sm text-emerald-950">
                {bench.strengths.map((s) => (
                  <li key={s}>— {s}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {bench.gaps.length > 0 ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-900">Pressure points</p>
              <ul className="mt-2 space-y-1 text-sm text-amber-950">
                {bench.gaps.map((g) => (
                  <li key={g}>— {g}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}

/** Explicit what-if / replay recommendation surfaced outside the carousel. */
export function DebriefNextRunCard({
  report,
  archetypeAdvice,
  className,
}: {
  report: TeachingReport;
  archetypeAdvice: string;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50/90 via-white to-white p-5 shadow-sm sm:p-6",
        className,
      )}
      aria-labelledby="next-run-experiment-heading"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start">
        <div className="rounded-xl border border-indigo-100 bg-white p-2.5">
          <FlaskConical className="h-6 w-6 text-indigo-600" aria-hidden />
        </div>
        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-700">Next run experiment</p>
            <h2 id="next-run-experiment-heading" className="mt-1 text-lg font-semibold tracking-tight text-slate-950">
              What to change on replay to sharpen the diagnostic
            </h2>
          </div>
          <p className="text-sm leading-7 text-slate-800">{report.nextMove}</p>
          <div className="rounded-xl border border-indigo-100 bg-white/80 px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Leadership posture lens</p>
            <p className="mt-1 text-sm leading-6 text-slate-700">{archetypeAdvice}</p>
          </div>
          <p className="text-xs leading-5 text-slate-500">
            Treat this as one controlled variable test: change budget mix <span className="font-medium">or</span> channel emphasis{" "}
            <span className="font-medium">or</span> quarter pacing — then compare rubric movement, not only headline revenue.
          </p>
        </div>
      </div>
    </section>
  );
}
