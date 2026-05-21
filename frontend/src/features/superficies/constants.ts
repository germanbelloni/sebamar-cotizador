export const LIMITES_superficies = {
  anchoMin: 20,
  anchoMax: 500,

  altoMin: 20,
  altoMax: 300,
};

export const tiposSuperficie = [
  {
    label: "Paño fijo",
    value: "pano-fijo",
  },

  {
    label: "Premarco",
    value: "premarco",
  },

  {
    label: "Contramarco",
    value: "contramarco",
  },
] as const;

export const lineasSuperficie = [
  {
    label: "Herrero",
    value: "herrero",
  },

  {
    label: "Modena",
    value: "modena",
  },
] as const;

export const vidriosSuperficie = [
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
    label: "6mm",
    value: "6mm",
  },

  {
    label: "Fantasia",
    value: "fantasia",
  },

  {
    label: "Esmerilado",
    value: "esmerilado",
  },

  {
    label: "3+3",
    value: "3+3",
  },

  {
    label: "4+4",
    value: "4+4",
  },

  {
    label: "5+5",
    value: "5+5",
  },

  {
    label: "DVH",
    value: "dvh",
  },
] as const;
