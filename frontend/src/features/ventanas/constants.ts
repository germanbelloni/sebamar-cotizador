import type { VentanaConfig } from "./types";
export const coloresVentana = [
  {
    label: "blanco",
    value: "blanco",
    clase: "bg-white border",
  },

  {
    label: "negro",
    value: "negro",
    clase: "bg-background",
  },

  {
    label: "bronce colonial",
    value: "bronce colonial",
    clase: "bg-amber-700",
  },

  {
    label: "simil madera",
    value: "simil madera",
    clase: "bg-orange-900",
  },
] as const;

export type ColorVentana = (typeof coloresVentana)[number]["value"];

export const LIMITES_LINEA = {
  Herrero: {
    anchoMin: 50,
    anchoMax: 240,

    altoMin: 30,
    altoMax: 210,
  },

  Modena: {
    anchoMin: 30,
    anchoMax: 400,

    altoMin: 30,
    altoMax: 260,
  },
};
export const initialVentanasConfig: VentanaConfig = {
  ancho: 120,

  alto: 100,

  linea: "Herrero",

  color: "blanco",

  tipoVidrio: "3mm",

  mosquitero: false,

  guia: false,

  cajonBlock: false,

  cortina: null,

  premarco: false,

  contramarco: false,
};
