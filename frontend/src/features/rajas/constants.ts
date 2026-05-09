export const LIMITES_RAJAS = {
  Herrero: {
    anchoMin: 30,
    anchoMax: 200,

    altoMin: 30,
    altoMax: 200,
  },

  Modena: {
    anchoMin: 30,
    anchoMax: 240,

    altoMin: 30,
    altoMax: 200,
  },
};

export const modelosRajaHerrero = [
  {
    label: "Raja",
    value: "raja",
  },

  {
    label: "Brazo",
    value: "brazo",
  },

  {
    label: "Volcable",
    value: "volcable",
  },
] as const;

export const modelosRajaModena = [
  {
    label: "Raja",
    value: "raja",
  },

  {
    label: "Oscilobatiente",
    value: "oscilobatiente",
  },
] as const;

export const vidriosRaja = [
  {
    label: "3mm",
    value: "3mm",
  },

  {
    label: "4mm",
    value: "4mm",
  },

  {
    label: "5mm",
    value: "5mm",
  },

  {
    label: "Esmerilado",
    value: "esmerilado",
  },

  {
    label: "Fantasía",
    value: "fantasia",
  },

  {
    label: "3+3",
    value: "3+3",
  },
] as const;
