import { GAME_CONSTANTS } from "@/constants/game";
import { ENDING_COPY, EndingCopy, EndingKey } from "@/constants/copy/endings";
import { Game, GameEndReason } from "@/types/game";

export interface GameSummaryData {
  endingKey: EndingKey;
  copy: EndingCopy;
  timeUsedSeconds: number;
  score: number;
  hintsUsed: number;
  solvedPuzzleIds: number[];
  solvedRoomsCount: number;
  totalRooms: number;
}

function resolveEndingKey(
  status: Game["status"],
  endReason?: GameEndReason | null,
): EndingKey {
  if (status === "completed") return "completed";
  if (endReason === "attemptsExceeded") return "attemptsExceeded";
  if (endReason === "timeExpired") return "timeExpired";
  return "abandoned";
}

export function useGameSummary(game: Game | null): GameSummaryData | null {
  if (!game) return null;

  const endingKey = resolveEndingKey(game.status, game.endReason);
  const copy = ENDING_COPY[endingKey];
  const state = game.state;

  const timeUsedSeconds = state
    ? Math.max(
        0,
        GAME_CONSTANTS.INITIAL_TIME_SECONDS - state.timeRemainingSeconds,
      )
    : 0;

  const score = state?.score ?? 0;
  // state.hintsUsed = pistes utilitzades a l'ÚLTIMA SALA, NO total de la partida
  const hintsUsed = state?.hintsUsed ?? 0;
  const solvedPuzzleIds = state?.solvedPuzzleIds ?? [];
  const solvedRoomsCount = solvedPuzzleIds.length;
  const totalRooms = 3;

  return {
    endingKey,
    copy,
    timeUsedSeconds,
    score,
    hintsUsed,
    solvedPuzzleIds,
    solvedRoomsCount,
    totalRooms,
  };
}
