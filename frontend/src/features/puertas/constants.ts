export const LIMITES_PUERTAS = {
  herrero: {
    anchoMin: 70,
    anchoMax: 300,

    altoMin: 180,
    altoMax: 250,
  },

  modena: {
    anchoMin: 70,
    anchoMax: 300,

    altoMin: 180,
    altoMax: 250,
  },

  eco: {
    anchoMin: 70,
    anchoMax: 300,

    altoMin: 180,
    altoMax: 250,
  },
};

export const tiposPuerta = [
  {
    label: "Simple",
    value: "simple",
  },

  {
    label: "Corredizo",
    value: "corredizo",
  },

  {
    label: "Plegadizo",
    value: "plegadizo",
  },
] as const;

export const vidriosPuerta = [
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
] as const;

export const modelosPuertaHerrero = [
  {
    label: "Modelo 12",
    value: "modelo 12",
  },

  {
    label: "Modelo Panel",
    value: "modelo panel",
  },
] as const;

export const modelosPuertaModena = [
  {
    label: "Modelo 12",
    value: "modelo 12",
  },

  {
    label: "Modelo c/panel",
    value: "modelo c/panel",
  },
] as const;

export const modelosPuertaEco = [
  {
    label: "Modelo 1 VR",
    value: "modelo 1 vr",
  },
] as const;
