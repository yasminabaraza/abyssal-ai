"use client";

import EndingHero from "@/components/game-over/Endinghero";
import RoomsProgress from "@/components/game-over/RoomsProgress";
import StatCard from "@/components/game-over/StatCard";
import Navbar from "@/components/layout/Navbar";
import { PATHS } from "@/constants/paths";
import { useGameSummary } from "@/hooks/useGameSummary";
import useLastGame from "@/hooks/useLastGame";
import useStartGame from "@/hooks/useStartGame";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useGameSound } from "@/hooks/useGameSound";

function formatRoomUrl(order: number): string {
  return String(order).padStart(2, "0");
}

function formatTime(totalSeconds: number): string {
  const clamped = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(clamped / 60);
  const seconds = clamped % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function GameOverPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, isLoading } = useLastGame();
  const startGame = useStartGame();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const game = data?.game ?? null;

  const summary = useGameSummary(game);

  // Reprodueix el so de final una sola vegada quan tenim el resultat
  useGameSound(summary?.endingKey ?? null);

  const handleNewMission = () => {
    if (startGame.isPending) return;
    setErrorMessage(null);
    startGame.mutate(undefined, {
      onSuccess: (response) => {
        queryClient.setQueryData(["activeGame"], response);
        queryClient.invalidateQueries({ queryKey: ["lastGame"] });
        const order = response.game.currentRoom.order;
        router.push(`${PATHS.ROOM}/${formatRoomUrl(order)}`);
      },
      onError: () => {
        setErrorMessage(
          "No s'ha pogut iniciar una nova missió. Torna-ho a intentar.",
        );
      },
    });
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#030d14] text-cyan-400 font-mono">
      <Navbar />

      <div className="flex-1 flex items-start justify-center px-4 py-10">
        {isLoading && (
          <div className="animate-pulse tracking-widest text-sm mt-24 text-cyan-800">
            CARREGANT INFORME FINAL...
          </div>
        )}

        {!isLoading && (!game || !summary) && (
          <div className="flex flex-col items-center gap-5 max-w-md text-center mt-24">
            <p className="text-[10px] text-cyan-800 tracking-[0.4em] uppercase">
              {"No s'ha trobat cap partida finalitzada."}
            </p>
            <button
              onClick={handleNewMission}
              disabled={startGame.isPending}
              className="px-10 py-4 border border-cyan-400 text-cyan-400 text-xs tracking-[0.4em] uppercase hover:bg-cyan-400 hover:text-black transition disabled:opacity-50"
            >
              {startGame.isPending ? "▶ CREANT MISSIÓ..." : "▶ NOVA MISSIÓ"}
            </button>
          </div>
        )}

        {!isLoading && game && summary && (
          <div className="w-full max-w-xl flex flex-col gap-8">
            {/* 1. Narrativa del final */}
            <EndingHero copy={summary.copy} />

            {/* 2. Mètriques */}
            <dl className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <StatCard
                label="Temps usat"
                value={formatTime(summary.timeUsedSeconds)}
                icon="⏱"
              />
              <StatCard
                label="Puntuació"
                value={summary.score.toLocaleString("ca")}
                variant={
                  summary.endingKey === "completed" ? "success" : "default"
                }
                icon="◈"
              />
              {/* summary.hintsUsed indica les pistes utilitzades a l’última sala, no el total de la partida */}
              <StatCard
                label="Pistes utilitzades a l’última sala"
                value={summary.hintsUsed}
                variant={
                  summary.hintsUsed === 0
                    ? "muted"
                    : summary.hintsUsed >= 3
                      ? "danger"
                      : "warning"
                }
                subtext={summary.hintsUsed === 0 ? "cap pista" : undefined}
                icon="◆"
              />
              <StatCard
                label="Sales resoltes"
                value={`${summary.solvedRoomsCount} / ${summary.totalRooms}`}
                variant={
                  summary.solvedRoomsCount === summary.totalRooms
                    ? "success"
                    : summary.solvedRoomsCount === 0
                      ? "danger"
                      : "default"
                }
                icon="▣"
              />
            </dl>

            {/* 3. Progrés per sala */}
            <RoomsProgress
              solvedCount={summary.solvedRoomsCount}
              totalRooms={summary.totalRooms}
            />

            <hr className="border-cyan-900/20" />

            {/* 4. Accions */}
            <div className="flex flex-col items-center gap-4 pb-4">
              <button
                onClick={handleNewMission}
                disabled={startGame.isPending}
                className="px-14 py-4 border border-cyan-400 text-cyan-400 text-xs tracking-[0.4em] uppercase hover:bg-cyan-400 hover:text-black transition disabled:opacity-50 disabled:cursor-wait"
              >
                {startGame.isPending ? "▶ CREANT MISSIÓ..." : "▶ NOVA MISSIÓ"}
              </button>

              {errorMessage && (
                <p className="text-[10px] text-red-400 tracking-widest uppercase">
                  {errorMessage}
                </p>
              )}

              <button
                onClick={() => router.push(PATHS.HOME)}
                className="text-[9px] text-cyan-900 tracking-widest uppercase hover:text-cyan-400 transition"
              >
                ⇠ Tornar a inici
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
