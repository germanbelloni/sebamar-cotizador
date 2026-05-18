import type { PostigonesConfig } from "./types";

export const LIMITES_POSTIGONES = {
  anchoMin: 60,

  anchoMax: 240,

  altoMin: 60,

  altoMax: 210,
};

export const coloresPostigones = [
  {
    label: "Blanco",

    value: "blanco",

    clase: "bg-white",
  },

  {
    label: "Negro",

    value: "negro",

    clase: "bg-background",
  },

  {
    label: "Bronce Colonial",

    value: "bronce colonial",

    clase: "bg-amber-700",
  },

  {
    label: "Simil Madera",

    value: "simil madera",

    clase: "bg-orange-900",
  },
] as const;

// =========================
// 🚀 CONFIG INICIAL
// =========================

export const initialPostigonesConfig: PostigonesConfig = {
  ancho: 120,

  alto: 120,

  tipo: "abrir",

  color: "blanco",

  cantidadHojas: 2,

  hojaCierre: "derecha",

  microperforado: false,

  herrajeBlanco: false,

  marco: "ancho",
};
