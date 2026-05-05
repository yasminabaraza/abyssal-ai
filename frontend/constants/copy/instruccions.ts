export const INSTRUCTIONS_COPY = {
  title: "PROTOCOL D'OPERACIÓ",
  subtitle:
    "Benvingut, agent. Llegeix atentament les instruccions de missió abans d'accedir a l'estació.",

  steps: [
    {
      num: "01",
      title: "Explora",
      desc: "Fes clic sobre els elements de la sala per examinar-los. Cada objecte pot contenir una pista, un codi o informació crítica.",
    },
    {
      num: "02",
      title: "Llegeix les pistes",
      desc: "El panell dret mostra el detall dels objectes i les pistes recollides. Analitza amb cura.",
    },
    {
      num: "03",
      title: "Resol l'enigma",
      desc: "Cada sala té un enigma central. Introdueix la resposta al camp de text.",
    },
    {
      num: "04",
      title: "Avança",
      desc: "En resoldre l'enigma, s'obre la porta següent. El progrés es desa automàticament.",
    },
  ],

  ai: {
    title: "ABYSS AI — ASSISTENT D'EMERGÈNCIA",
    description:
      "Si et quedes encallat, pots demanar pista al terminal de l'Abyss AI (panell flotant a la sala). Cada consulta consumeix una de les pistes disponibles per la sala.",
    bullets: [
      "Clica el terminal ABYSS AI per obrir el xat amb l'assistent.",
      "Les pistes són limitades per sala — usa-les amb criteri.",
      "L'estat (ONLINE / PROCESSANT / OFFLINE) indica si pots consultar.",
      "Si la quota s'esgota, podràs veure el log però no demanar més pistes.",
    ],
  },

  alert:
    " AVÍS DE MISSIÓ: L'estació està en quarantena. Tens temps limitat per sala. No cometis errors.",

  controls: [
    "Clic esquerre sobre un objecte  → Examinar",
    "Camp de text + ENTER → Enviar resposta",
    "Icona de disc + Guardar → Progrés manual",
    "ESC Menu principal(la partida es desa) → Sortir",
  ],

  cta: {
    secondary: "Tornar a l'inici",
  },
};
