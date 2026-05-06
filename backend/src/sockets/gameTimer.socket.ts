import { Server } from "socket.io";
import {
  getUpdatedGameTimer,
  persistGameTimer,
} from "../services/timer.service";

const PERSIST_INTERVAL_MS = 15000;

export function registerGameTimerSocket(io: Server) {
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    let currentInterval: ReturnType<typeof setInterval> | null = null;
    let currentGameId: number | null = null;
    let currentTimeRemainingSeconds: number | null = null;

    const clearCurrentTimer = async () => {
      if (currentInterval) {
        clearInterval(currentInterval);
        currentInterval = null;
      }

      if (currentGameId && currentTimeRemainingSeconds !== null) {
        await persistGameTimer(currentGameId, currentTimeRemainingSeconds);
      }
    };

    socket.on("timer:join", async ({ gameId }) => {
      try {
        const numericGameId = Number(gameId);

        if (!numericGameId) {
          socket.emit("timer:error", { message: "Invalid gameId" });
          return;
        }

        await clearCurrentTimer();

        currentGameId = numericGameId;

        socket.join(`game:${numericGameId}`);

        const timer = await getUpdatedGameTimer(numericGameId);

        // Ancorem el càlcul al rellotge real per evitar deriva del setInterval.
        // Cada tick recalcula `remaining` a partir del temps real transcorregut
        // des de l'arrencada, no acumulant -1 per tick (que es desfasa amb GC,
        // event loop bloquejat, awaits a la BD, etc.).
        const tickStartedAtMs = Date.now();
        const tickStartRemainingSeconds = timer.timeRemainingSeconds;
        currentTimeRemainingSeconds = tickStartRemainingSeconds;
        let lastPersistedAtMs = tickStartedAtMs;

        socket.emit("timer:update", {
          gameId: numericGameId,
          timeRemainingSeconds: currentTimeRemainingSeconds,
        });

        currentInterval = setInterval(() => {
          const elapsedSeconds = Math.floor(
            (Date.now() - tickStartedAtMs) / 1000,
          );
          const nextRemaining = Math.max(
            0,
            tickStartRemainingSeconds - elapsedSeconds,
          );

          currentTimeRemainingSeconds = nextRemaining;

          io.to(`game:${numericGameId}`).emit("timer:update", {
            gameId: numericGameId,
            timeRemainingSeconds: nextRemaining,
          });

          const shouldPersist =
            Date.now() - lastPersistedAtMs >= PERSIST_INTERVAL_MS ||
            nextRemaining === 0;

          if (shouldPersist) {
            lastPersistedAtMs = Date.now();
            // Fire-and-forget: l'await dins del tick endarreria la cadència
            // i feia perdre precisió. Si falla, només impacta la persistència
            // periòdica; el següent tick o el clearCurrentTimer ho reintentaran.
            persistGameTimer(numericGameId, nextRemaining).catch((err) => {
              console.error("persistGameTimer failed:", err);
            });
          }

          if (nextRemaining === 0) {
            io.to(`game:${numericGameId}`).emit("timer:ended", {
              gameId: numericGameId,
              reason: "timeExpired",
            });

            if (currentInterval) {
              clearInterval(currentInterval);
              currentInterval = null;
            }
          }
        }, 1000);
      } catch (error) {
        console.error("Timer socket error:", error);

        socket.emit("timer:error", {
          message: "Could not load timer",
        });
      }
    });

    socket.on("timer:leave", async ({ gameId }) => {
      const numericGameId = Number(gameId);

      if (!numericGameId) return;

      socket.leave(`game:${numericGameId}`);

      if (currentGameId === numericGameId) {
        await clearCurrentTimer();
        currentGameId = null;
        currentTimeRemainingSeconds = null;
      }

      console.log(`Client left game ${numericGameId}`);
    });

    socket.on("disconnect", async () => {
      await clearCurrentTimer();
      console.log("Client disconnected:", socket.id);
    });
  });
}
