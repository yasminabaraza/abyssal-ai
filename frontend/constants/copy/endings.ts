/**
 * Copy narratiu per a la pantalla de final de partida.
 * Tono: Abyss AI — fred, irònic, distant, quasi sarcàstic.
 * Consistents amb els idlePhrases del seed.
 */

export type EndingKey =
  | "completed"
  | "timeExpired"
  | "attemptsExceeded"
  | "abandoned";

export interface EndingCopy {
  /** Etiqueta petita sobre el títol */
  eyebrow: string;
  title: string;
  /** Missatge principal de l'Abyss AI */
  aiMessage: string;
  /** Línia final freda/irònica, com a signatura de l'AI */
  aiSignature: string;
  /** Color del títol (classe Tailwind) */
  titleColor: string;
  /** Color de l'accent general */
  accentColor: "green" | "red" | "orange" | "slate";
}

export const ENDING_COPY: Record<EndingKey, EndingCopy> = {
  completed: {
    eyebrow: "INFORME FINAL · ESTAT: RESOLT",
    title: "MISSIÓ COMPLETADA",
    aiMessage:
      "Protocols de quarantena desactivats. Contacte amb la superfície restablert. " +
      "El sistema registra la teva actuació com a estadísticament improbable. " +
      "Felicitacions, en la mesura que el concepte sigui aplicable.",
    aiSignature: "— Abyss AI. El sistema no expressa emocions. Però ho nota.",
    titleColor: "text-green-400",
    accentColor: "green",
  },

  timeExpired: {
    eyebrow: "INFORME FINAL · ESTAT: TEMPS ESGOTAT",
    title: "TEMPS ESGOTAT",
    aiMessage:
      "El temps assignat ha expirat. Els compartiments han estat segellats " +
      "de manera permanent per ordre del protocol de contenció. " +
      "El sistema ha registrat cada segon perdut. Tots ells.",
    aiSignature: "— Abyss AI. La puntualitat no era opcional.",
    titleColor: "text-red-400",
    accentColor: "red",
  },

  attemptsExceeded: {
    eyebrow: "INFORME FINAL · ESTAT: ACCÉS DENEGAT",
    title: "INTENTS EXHAURITS",
    aiMessage:
      "Has superat el límit d'intents permesos. El sistema ha interpretat " +
      "aquesta seqüència com una amenaça i ha activat el bloqueig complet. " +
      "Estadísticament, repetir el mateix error és una elecció conscient.",
    aiSignature: "— Abyss AI. La insistència no és una virtut reconeguda.",
    titleColor: "text-orange-400",
    accentColor: "orange",
  },

  abandoned: {
    eyebrow: "INFORME FINAL · ESTAT: CONNEXIÓ TANCADA",
    title: "MISSIÓ ABANDONADA",
    aiMessage:
      "Has interromput la seqüència de manera voluntària. " +
      "Els compartiments romanen segellats. La situació és idèntica a com era. " +
      "El sistema no jutja les decisions. Simplement les arxiva.",
    aiSignature: "— Abyss AI. L'abandó queda registrat indefinidament.",
    titleColor: "text-slate-400",
    accentColor: "slate",
  },
};
