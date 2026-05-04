import { GAME_CONSTANTS } from "../constants/game.constants";
import { gameActionRepository } from "../repositories/gameAction.repository";
import { GameState } from "../types/game";

export type Rank = "Recruit" | "Operative" | "Elite";

export type RecentGame = {
  id: number;
  status: string;
  endReason: string | null;
  createdAt: Date;
  score: number;
  hintsUsed: number;
};

export type UserStats = {
  gamesPlayed: number;
  gamesCompleted: number;
  gamesAbandoned: number;
  gamesTimeExpired: number;
  gamesActive: number;
  completionRate: number;
  victories: number;
  attempts: number;
  totalHintsUsed: number;
  avgScore: number;
  maxScore: number;
  avgTimeFormatted: string;
  recentGames: RecentGame[];
};

export const deriveRank = (completionRate: number): Rank => {
  if (completionRate >= 80) return "Elite";
  if (completionRate >= 50) return "Operative";
  return "Recruit";
};

/**
 * Use case: calcular estadístiques agregades d'un usuari.
 *
 * Responsabilitats:
 * - Recuperar les partides de l'usuari (via repository).
 * - Aplicar les regles de negoci de comptatge i agregació
 *   (victòria = endReason "success", càlcul de mitjanes, projecció de recents...).
 *
 * Notes d'arquitectura:
 * - Aquest use case NO parla amb Prisma directament.
 */
export const getUserStatsUseCase = async (
  userId: number,
): Promise<UserStats> => {
  const games = await gameActionRepository.findAllByUserForStats(userId);

  const gamesPlayed = games.length;
  const gamesCompleted = games.filter((g) => g.endReason === "success").length;
  const gamesAbandoned = games.filter(
    (g) => g.endReason === "abandoned",
  ).length;
  const gamesTimeExpired = games.filter(
    (g) => g.endReason === "timeExpired",
  ).length;
  const gamesActive = games.filter((g) => g.status === "active").length;

  let totalScore = 0;
  let maxScore = 0;
  let totalHintsUsed = 0;
  let totalTimeUsedSeconds = 0;
  let gamesWithState = 0;

  for (const game of games) {
    const state = game.state as GameState | null;
    if (!state) continue;

    gamesWithState++;

    const score = state.score;
    const hints = state.hintsUsed;
    const timeRemaining = state.timeRemainingSeconds;

    const initialTime =
      typeof state.initialTimeSeconds === "number"
        ? state.initialTimeSeconds
        : GAME_CONSTANTS.INITIAL_TIME_SECONDS;

    totalScore += score;
    if (score > maxScore) maxScore = score;
    totalHintsUsed += hints;
    totalTimeUsedSeconds += initialTime - timeRemaining;
  }

  const avgScore =
    gamesWithState > 0 ? Math.round(totalScore / gamesWithState) : 0;

  const avgTimeUsedSeconds =
    gamesWithState > 0 ? Math.round(totalTimeUsedSeconds / gamesWithState) : 0;

  const avgMinutes = Math.floor(avgTimeUsedSeconds / 60);
  const avgSeconds = avgTimeUsedSeconds % 60;
  const avgTimeFormatted = `${String(avgMinutes).padStart(2, "0")}:${String(
    avgSeconds,
  ).padStart(2, "0")}`;

  const completionRate =
    gamesPlayed === 0 ? 0 : Math.round((gamesCompleted / gamesPlayed) * 100);

  const recentGames: RecentGame[] = games.slice(0, 5).map((g) => ({
    id: g.id,
    status: g.status,
    endReason: g.endReason,
    createdAt: g.createdAt,
    score: (g.state as any)?.score ?? 0,
    hintsUsed: (g.state as any)?.hintsUsed ?? 0,
  }));

  return {
    gamesPlayed,
    gamesCompleted,
    gamesAbandoned,
    gamesTimeExpired,
    gamesActive,
    completionRate,
    victories: gamesCompleted,
    attempts: 0,
    totalHintsUsed,
    avgScore,
    maxScore,
    avgTimeFormatted,
    recentGames,
  };
};
