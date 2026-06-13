import type { MarcoTipo, MarcoColor } from "./types";
import type { MarcosConfig } from "./types";

export const LIMITES_MARCOS = {
  anchoMin: 30,
  anchoMax: 300,
  altoMin: 30,
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
export const initialMarcosConfig: MarcosConfig = {
  ancho: 120,

  alto: 100,

  tipo: "premarco",

  color: "blanco",
};
