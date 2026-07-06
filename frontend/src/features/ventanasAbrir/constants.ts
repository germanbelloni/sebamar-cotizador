import type { VentanasAbrirConfig } from "./types";

export const LIMITES_VENTANAS_ABRIR = {
  Herrero: {
    anchoMin: 60,
    anchoMax: 200,

    altoMin: 30,
    altoMax: 180,
  },

  Modena: {
    anchoMin: 60,
    anchoMax: 200,

    altoMin: 30,
    altoMax: 180,
  },
} as const;

export const vidriosVentanasAbrir = [
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

export const initialVentanasAbrirConfig: VentanasAbrirConfig = {
  ancho: 60,
  alto: 60,

  linea: "Herrero",

  color: "blanco",

  tipoVidrio: "4mm",

  mosquitero: false,

  bisagra: "izquierda",

  premarco: false,

  contramarco: false,

  herrajesBlancos: false,
};
