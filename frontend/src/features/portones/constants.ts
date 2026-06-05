import type { PortonesConfig } from "./types";
export const LIMITES_PORTONES = {
  Herrero: {
    anchoMin: 200,

    anchoMax: 600,

    altoMin: 150,

    altoMax: 260,
  },

  Modena: {
    anchoMin: 200,

    anchoMax: 500,

    altoMin: 150,

    altoMax: 260,
  },
};

export const initialPortonesConfig: PortonesConfig = {
  ancho: 250,

  alto: 220,

  linea: "Herrero",

  sistema: "corredizo",

  hojas: 2,

  color: "blanco",

  automatizado: false,

  guiaInferior: false,
};
