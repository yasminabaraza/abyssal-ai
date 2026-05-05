"use client";

import { EndingCopy } from "@/constants/copy/endings";

const ACCENT: Record<
  EndingCopy["accentColor"],
  { border: string; text: string; bg: string; badge: string }
> = {
  green: {
    border: "border-green-900/40",
    text: "text-green-700",
    bg: "bg-green-950/20",
    badge: "border-green-900/50 text-green-600 bg-green-950/30",
  },
  red: {
    border: "border-red-900/40",
    text: "text-red-800",
    bg: "bg-red-950/20",
    badge: "border-red-900/50 text-red-500 bg-red-950/30",
  },
  orange: {
    border: "border-orange-900/40",
    text: "text-orange-800",
    bg: "bg-orange-950/20",
    badge: "border-orange-900/50 text-orange-500 bg-orange-950/30",
  },
  slate: {
    border: "border-slate-800/40",
    text: "text-slate-600",
    bg: "bg-slate-900/20",
    badge: "border-slate-700/50 text-slate-500 bg-slate-900/30",
  },
};

interface EndingHeroProps {
  copy: EndingCopy;
}

export default function EndingHero({ copy }: EndingHeroProps) {
  const accent = ACCENT[copy.accentColor];

  return (
    <header className="flex flex-col items-center text-center gap-5">
      {/* Eyebrow */}
      <span className="text-[9px] tracking-[0.55em] text-cyan-900 uppercase">
        {copy.eyebrow}
      </span>

      {/* Títol principal */}
      <h1
        className={`text-4xl md:text-5xl font-black tracking-[0.25em] leading-tight ${copy.titleColor}`}
      >
        {copy.title}
      </h1>

      {/* Bloc narratiu de l'Abyss AI */}
      <div
        className={`w-full max-w-lg rounded border px-6 py-4 text-left ${accent.border} ${accent.bg}`}
      >
        {/* Capçalera del bloc */}
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`text-[8px] tracking-[0.5em] uppercase ${accent.text}`}
          >
            ABYSS AI · TRANSMISSIÓ FINAL
          </span>
          {/* Indicador parpellejant */}
          <span
            className={`inline-block w-1.5 h-1.5 rounded-full animate-pulse ${
              copy.accentColor === "green"
                ? "bg-green-600"
                : copy.accentColor === "red"
                  ? "bg-red-600"
                  : copy.accentColor === "orange"
                    ? "bg-orange-600"
                    : "bg-slate-600"
            }`}
          />
        </div>

        {/* Missatge */}
        <p className="text-xs text-cyan-600 leading-relaxed tracking-wide">
          {copy.aiMessage}
        </p>

        {/* Signatura */}
        <p className={`text-[10px] mt-3 italic tracking-wide ${accent.text}`}>
          {copy.aiSignature}
        </p>
      </div>
    </header>
  );
}
