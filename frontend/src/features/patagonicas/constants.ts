export const LIMITES_PATAGONICAS = {
  Herrero: {
    anchoMin: 80,
    anchoMax: 200,

    altoMin: 40,
    altoMax: 150,
  },

  Modena: {
    anchoMin: 120,
    anchoMax: 240,

    altoMin: 40,
    altoMax: 200,
  },
};

export const tiposPatagonicas = [
  {
    label: "1 Raja",
    value: "1_raja",
  },

  {
    label: "2 Rajas",
    value: "2_rajas",
  },
] as const;

export const vidriosPatagonicas = [
  {
    label: "4mm",
    value: "4mm",
  },

  {
    label: "3+3",
    value: "3+3",
  },
] as const;
