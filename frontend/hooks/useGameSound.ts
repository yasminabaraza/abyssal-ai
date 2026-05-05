import { useEffect, useRef } from "react";
import { EndingKey } from "@/constants/copy/endings";

/**
 * Reprodueix el so de final de partida una sola vegada.
 *
 * Problema: quan la partida acaba per temps o intents, la redirecció és
 * automàtica i el navegador bloqueja l'autoplay (no hi ha hagut interacció
 * de l'usuari a la nova pàgina). Per això intentem reproduir immediatament
 * i, si falla, esperem el primer clic/tecla de l'usuari.
 */

export function useGameSound(endingKey: EndingKey | null) {
  const playedRef = useRef(false);

  useEffect(() => {
    if (!endingKey || playedRef.current) return;

    const audio = new Audio("/sounds/blendertimer-escape.mp3");
    audio.volume = 0.5;

    const playAudio = () => {
      audio.play().catch(() => {});
      playedRef.current = true;
      removeListeners();
    };

    const removeListeners = () => {
      window.removeEventListener("click", playAudio);
      window.removeEventListener("keydown", playAudio);
      window.removeEventListener("touchstart", playAudio);
    };

    // Intent immediat (funciona si l'usuari ha clicat durant la partida)
    audio
      .play()
      .then(() => {
        playedRef.current = true;
      })
      .catch(() => {
        // Autoplay bloquejat — esperem la primera interacció de l'usuari
        window.addEventListener("click", playAudio);
        window.addEventListener("keydown", playAudio);
        window.addEventListener("touchstart", playAudio);
      });

    return () => {
      removeListeners();
      audio.pause();
      audio.src = "";
    };
  }, [endingKey]);
}
