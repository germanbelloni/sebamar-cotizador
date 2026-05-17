import type { MarcoTipo, MarcoColor } from "./types";

export const LIMITES_MARCOS = {
  anchoMin: 20,

  anchoMax: 500,

  altoMin: 20,

  altoMax: 300,
};

export const TIPOS_MARCOS: {
  label: string;

  value: MarcoTipo;
}[] = [
  {
    label: "Premarco",

    value: "premarco",
  },

  {
    label: "Contramarco",

    value: "contramarco",
  },
];

export const COLORES_CONTRAMARCO: {
  label: string;

  value: MarcoColor;
}[] = [
  {
    label: "Blanco",

    value: "blanco",
  },

  {
    label: "Negro",

    value: "negro",
  },

  {
    label: "Bronce colonial",

    value: "bronce colonial",
  },

  {
    label: "Simil madera",

    value: "simil madera",
  },
];
