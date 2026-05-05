import { useGameContext } from "@/context/GameContext";

const TimerDisplay = () => {
  const { timeRemainingSeconds } = useGameContext();

  const timeRemaining = timeRemainingSeconds;

  const isExpired = timeRemaining <= 0;

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  // Determine the color class based on the time remaining
  const isWarning = timeRemaining < 300; // < 5 min
  const isCritical = timeRemaining < 60; // < 1 min
  const isFinalSeconds = timeRemaining <= 10;

  const colorClass = isExpired
    ? "text-red-600 animate-pulse"
    : isFinalSeconds
      ? "text-red-500 animate-bounce scale-110"
      : isCritical
        ? "text-red-400 animate-pulse"
        : isWarning
          ? "text-amber-400"
          : "text-cyan-200";

  const containerClass = isFinalSeconds ? "transition-all duration-300" : "";

  return (
    <div className={`flex justify-between items-center ${containerClass}`}>
      <span className="text-cyan-700 text-[9px] uppercase">Temps</span>

      <span
        className={`text-sm font-bold tracking-widest transition-all duration-300 ${colorClass}`}
      >
        {formattedTime}
      </span>
    </div>
  );
};

export default TimerDisplay;
