import Link from 'next/link';

export default function CreditsPage() {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 pb-12 pt-10 md:px-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">Credits</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Third-party assets and design references used to build the CMO Simulator experience.
        </p>

        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5">
          <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">Figma Community</div>
          <div className="mt-2 text-base font-semibold text-slate-950">Rhombus Multi Purpose Dashboard UI Kit</div>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            UI patterns adapted from the free sample of the Rhombus dashboard kit by Designspace Team.
          </p>
          <div className="mt-4 flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:gap-4">
            <a
              className="font-semibold text-slate-800 underline decoration-slate-300 underline-offset-4 hover:text-slate-950"
              href="https://www.figma.com/community/file/1117974813137316859/rhombus-multi-purpose-dashboard-ui-kit"
              target="_blank"
              rel="noreferrer"
            >
              Source (Figma Community)
            </a>
            <a
              className="font-semibold text-slate-800 underline decoration-slate-300 underline-offset-4 hover:text-slate-950"
              href="https://creativecommons.org/licenses/by/4.0/"
              target="_blank"
              rel="noreferrer"
            >
              License (CC BY 4.0)
            </a>
            <span className="text-slate-600">Modifications: adapted for CMO Simulator UI components.</span>
          </div>
        </div>

        <div className="mt-6">
          <Link
            href="/sim/simulations"
            className="inline-flex rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
          >
            Back to simulations
          </Link>
        </div>
      </div>
    </section>
  );
}

