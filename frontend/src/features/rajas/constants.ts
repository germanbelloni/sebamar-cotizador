import type { RajasConfig } from "./types";
export const LIMITES_RAJAS = {
  Herrero: {
    anchoMin: 30,
    anchoMax: 100,

    altoMin: 30,
    altoMax: 180,
  },

  Modena: {
    anchoMin: 30,
    anchoMax: 100, // por ahora igual que Herrero; confirmar luego

    altoMin: 30,
    altoMax: 180, // según tablas de Modena que vimos
  },
} as const;
export const modelosRajaHerrero = [
  {
    label: "Raja",
    value: "raja",
  },

  {
    label: "Brazo",
    value: "brazo",
  },

  {
    label: "Volcable",
    value: "volcable",
  },
] as const;

export const modelosRajaModena = [
  {
    label: "Raja",
    value: "raja",
  },

  {
    label: "Oscilobatiente",
    value: "oscilobatiente",
  },
] as const;

export const vidriosRaja = [
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

export const initialRajasConfig: RajasConfig = {
  ancho: 60,
  alto: 60,

  linea: "Herrero",

  color: "blanco",

  tipoVidrio: "4mm",
  vidrioRepartido: false,

  mosquitero: false,

  modelo: "raja",

  bisagra: "izquierda",

  posicionOscilo: "cerrada",

  premarco: false,

  contramarco: false,

  herrajesBlancos: false,
};
