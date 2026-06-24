import type { PatagonicasConfig } from "./types";

export const LIMITES_PATAGONICAS = {
  Herrero: {
    anchoMin: 80,
    anchoMax: 240,

    altoMin: 40,
    altoMax: 180,
  },

  Modena: {
    anchoMin: 120,
    anchoMax: 300,

    altoMin: 40,
    altoMax: 220,
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

  {
    label: "4+4",
    value: "4+4",
  },

  {
    label: "DVH 4+9+4",
    value: "DVH 4+9+4",
  },

  {
    label: "DVH 5+9+5",
    value: "DVH 5+9+5",
  },
] as const;

export const medidasRajaPatagonicas = [
  {
    label: "40 cm",
    value: 40,
  },

  {
    label: "50 cm",
    value: 50,
  },

  {
    label: "60 cm",
    value: 60,
  },
] as const;

export const bisagrasPatagonicas = [
  {
    label: "Izquierda",
    value: "izquierda",
  },

  {
    label: "Derecha",
    value: "derecha",
  },
] as const;
export const ladosPatagonicas = [
  {
    label: "Abertura a la izquierda",
    value: "izquierda",
  },

  {
    label: "Abertura a la derecha",
    value: "derecha",
  },
] as const;
export const initialPatagonicasConfig: PatagonicasConfig = {
  // =========================
  // 📏 MEDIDAS
  // =========================

  ancho: 120,

  alto: 100,

  anchoRaja: 40,

  // =========================
  // 🪟 CONFIG
  // =========================

  linea: "Herrero",

  tipo: "1_raja",

  tipoRaja: "raja",

  cantidadRajas: 1,

  // =========================
  // 🎨 VISUAL
  // =========================

  color: "blanco",

  tipoVidrio: "4mm",

  // =========================
  // 🚪 APERTURA
  // =========================

  ladoApertura: "derecha",

  tipoApertura: "abrir",

  bisagraRaja1: "izquierda",

  bisagraRaja2: "derecha",

  // =========================
  // 🧩 OPCIONALES
  // =========================

  premarco: false,

  contramarco: false,

  herrajesBlancos: false,

  mosquitero: false,

  guia: false,

  cajonBlock: false,

  cortina: null,

  fueraDeMedida: false,
};
