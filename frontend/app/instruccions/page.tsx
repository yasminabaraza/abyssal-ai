"use client";
import Navbar from "@/components/layout/Navbar";
import { INSTRUCTIONS_COPY } from "@/constants/copy/instruccions";
import { useRouter } from "next/navigation";

export default function InstructionsPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-abyss-bg text-cyan-50 font-mono flex flex-col">
      <Navbar />

      <div className="relative z-10 flex items-center justify-center flex-1 px-6 py-6">
        <div className="w-full max-w-6xl border border-cyan-500/30 bg-cyan-950/20 p-6 shadow-[0_0_40px_rgba(34,211,238,0.1)]">
          {/* HEADER */}
          <header className="flex justify-between items-start mb-5 pb-4 border-b border-cyan-500/20">
            <div>
              <div className="text-[10px] tracking-[0.5em] text-cyan-700 uppercase mb-1">
                Briefing · Sector Alfa
              </div>
              <h1 className="text-2xl tracking-widest text-cyan-300 font-bold">
                {INSTRUCTIONS_COPY.title}
              </h1>
              <p className="text-cyan-600 text-sm mt-2 max-w-2xl leading-relaxed">
                {INSTRUCTIONS_COPY.subtitle}
              </p>
            </div>

            <button
              onClick={() => router.push("/")}
              className="text-cyan-600 hover:text-cyan-300 text-lg shrink-0"
              aria-label="Tancar"
            >
              ✕
            </button>
          </header>

          {/* FASES */}
          <section className="mb-5">
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-[10px] tracking-[0.5em] text-cyan-500 uppercase font-bold">
                Fases de la missió
              </h2>
              <div className="flex-1 h-px bg-cyan-900/50" />
            </div>
            <ol className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
              {INSTRUCTIONS_COPY.steps.map((step) => (
                <li
                  key={step.num}
                  className="border border-cyan-500/20 bg-cyan-950/10 p-4 relative hover:border-cyan-400/40 transition"
                >
                  <div className="text-3xl font-black text-cyan-500/30 leading-none mb-2">
                    {step.num}
                  </div>
                  <h3 className="text-cyan-300 font-bold text-sm tracking-wider mb-1">
                    {step.title}
                  </h3>
                  <p className="text-cyan-700 text-xs leading-relaxed">
                    {step.desc}
                  </p>
                </li>
              ))}
            </ol>
          </section>

          {/* ABYSS AI — destacat */}
          <section className="mb-5 border border-cyan-400/40 bg-linear-to-br from-cyan-950/40 to-cyan-950/10 p-5 shadow-[0_0_25px_rgba(34,211,238,0.08)]">
            <div className="flex items-center gap-3 mb-3">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
              </span>
              <h2 className="text-cyan-200 font-bold tracking-[0.3em] text-sm">
                {INSTRUCTIONS_COPY.ai.title}
              </h2>
            </div>
            <div className="grid md:grid-cols-[1fr_1.2fr] gap-5">
              <p className="text-cyan-500 text-sm leading-relaxed">
                {INSTRUCTIONS_COPY.ai.description}
              </p>
              <ul className="space-y-1.5">
                {INSTRUCTIONS_COPY.ai.bullets.map((b, i) => (
                  <li
                    key={i}
                    className="text-cyan-600 text-xs leading-relaxed flex gap-2"
                  >
                    <span className="text-cyan-400 shrink-0">›</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* CONTROLS + ALERT */}
          <section className="grid md:grid-cols-[1.6fr_1fr] gap-4 mb-5">
            {/* CONTROLS */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-[10px] tracking-[0.5em] text-cyan-500 uppercase font-bold">
                  Controls bàsics
                </h2>
                <div className="flex-1 h-px bg-cyan-900/50" />
              </div>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                {INSTRUCTIONS_COPY.controls.map((c, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 border-l border-cyan-500/30 pl-3 py-1"
                  >
                    <dt className="text-cyan-300 text-[11px] tracking-widest uppercase font-bold shrink-0 min-w-[110px]">
                      {c.key}
                    </dt>
                    <dd className="text-cyan-700 text-xs">{c.action}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* ALERT */}
            <aside className="border-l-2 border-yellow-500 bg-yellow-500/5 p-4">
              <div className="text-[10px] tracking-[0.4em] text-yellow-500 uppercase font-bold mb-1">
                Avís de missió
              </div>
              <p className="text-yellow-300/90 text-xs leading-relaxed">
                L&apos;estació està en quarantena. Tens temps limitat per sala.
                No cometis errors.
              </p>
            </aside>
          </section>

          {/* FOOTER */}
          <div className="flex justify-between pt-3 border-t border-cyan-500/20">
            <button
              onClick={() => router.push("/")}
              className="text-cyan-600 hover:text-cyan-300 text-xs tracking-widest uppercase"
            >
              ← {INSTRUCTIONS_COPY.cta.secondary}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
