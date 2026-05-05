"use client";

/** Noms hardcodejats que coincideixen amb el seed del backend */
const ROOMS = [
  { order: 1, name: "Sistema Central" },
  { order: 2, name: "Laboratori de Recerca" },
  { order: 3, name: "Mòdul d'Evacuació" },
] as const;

interface RoomsProgressProps {
  /** IDs de puzzles resolts. Com cada sala té 1 puzzle, length = sales resoltes */
  solvedCount: number;
  totalRooms: number;
}

export default function RoomsProgress({
  solvedCount,
  totalRooms,
}: RoomsProgressProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[9px] tracking-[0.5em] text-cyan-900 uppercase">
          Progrés per sala
        </span>
        <span className="text-[9px] text-cyan-800 tracking-widest">
          {solvedCount} / {totalRooms} completades
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        {ROOMS.map((room, i) => {
          const isCompleted = i < solvedCount;
          const isCurrent = i === solvedCount;
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const isPending = i > solvedCount;

          return (
            <div
              key={room.order}
              className={[
                "flex items-center gap-3 px-3 py-2.5 rounded border text-xs font-mono",
                isCompleted
                  ? "border-cyan-900/40 bg-[#07182a]"
                  : isCurrent
                    ? "border-red-900/50 bg-[#120a0a]"
                    : "border-cyan-950/30 bg-[#04101a] opacity-40",
              ].join(" ")}
            >
              {/* Número */}
              <span
                className={[
                  "font-black min-w-6.5 text-sm",
                  isCompleted
                    ? "text-cyan-700"
                    : isCurrent
                      ? "text-red-500"
                      : "text-cyan-900",
                ].join(" ")}
              >
                {String(room.order).padStart(2, "0")}
              </span>

              {/* Nom */}
              <span
                className={[
                  "flex-1 tracking-widest uppercase text-[10px]",
                  isCompleted
                    ? "text-cyan-400"
                    : isCurrent
                      ? "text-red-300"
                      : "text-cyan-900",
                ].join(" ")}
              >
                {room.name}
              </span>

              {/* Barra de progrés */}
              <div className="hidden sm:block w-16 h-0.5 bg-cyan-950 rounded-full overflow-hidden shrink-0">
                <div
                  className={[
                    "h-full rounded-full",
                    isCompleted
                      ? "bg-cyan-600 w-full"
                      : isCurrent
                        ? "bg-red-800 w-3/5"
                        : "w-0",
                  ].join(" ")}
                />
              </div>

              {/* Estat */}
              <span
                className={[
                  "text-[10px] tracking-widest min-w-16 text-right",
                  isCompleted
                    ? "text-green-500"
                    : isCurrent
                      ? "text-red-500"
                      : "text-cyan-900",
                ].join(" ")}
              >
                {isCompleted ? "✓ RESOLTA" : isCurrent ? "✗ PENDENT" : "— N/A"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
