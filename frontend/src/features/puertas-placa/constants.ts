import type {
  PuertasPlacaMarco,
  PuertasPlacaMedida,
  PuertasPlacaModelo,
  PuertasPlacaTipo,
} from "./types";

export const LIMITES_PUERTAS_PLACA = {
  anchoMin: 60,

  anchoMax: 100,

  altoMin: 150,

  altoMax: 210,
};

export const TIPOS_PUERTA_PLACA: {
  label: string;

  value: PuertasPlacaTipo;

  description: string;
}[] = [
  {
    label: "De abrir",

    value: "abrir",

    description: "Puerta placa tradicional",
  },

  {
    label: "De embutir",

    value: "embutir",

    description: "Sistema corredizo embutido",
  },

  {
    label: "Granero",

    value: "granero",

    description: "Sistema corredizo exterior",
  },
];

export const MEDIDAS_ABRIR: {
  label: string;

  value: PuertasPlacaMedida;

  ancho: number;

  alto: number;
}[] = [
  {
    label: "60 × 200",

    value: "60x200",

    ancho: 60,

    alto: 200,
  },

  {
    label: "70 × 200",

    value: "70x200",

    ancho: 70,

    alto: 200,
  },

  {
    label: "80 × 200",

    value: "80x200",

    ancho: 80,

    alto: 200,
  },
];

export const MEDIDAS_EMBUTIR: {
  label: string;

  value: PuertasPlacaMedida;

  ancho: number;

  alto: number;
}[] = [
  {
    label: "140 × 200",

    value: "140x200",

    ancho: 140,

    alto: 200,
  },

  {
    label: "160 × 200",

    value: "160x200",

    ancho: 160,

    alto: 200,
  },

  {
    label: "180 × 200",

    value: "180x200",

    ancho: 180,

    alto: 200,
  },
];

export const MEDIDAS_GRANERO = MEDIDAS_ABRIR;

export const MARCOS_ABRIR: {
  label: string;

  value: PuertasPlacaMarco;

  description?: string;
}[] = [
  {
    label: "Marco 10",

    value: "marco_10",

    description: "Finger 10 cm",
  },

  {
    label: "Marco 15",

    value: "marco_15",

    description: "Finger 15 cm",
  },

  {
    label: "Marco aluminio",

    value: "aluminio",

    description: "Aluminio blanco",
  },
];

export const MARCOS_EMBUTIR: {
  label: string;

  value: PuertasPlacaMarco;

  description?: string;
}[] = [
  {
    label: "Marco 15",

    value: "marco_15",

    description: "Finger 15 cm",
  },
];

export const MODELOS_MARCO_10: {
  label: string;

  value: PuertasPlacaModelo;
}[] = [
  {
    label: "Finger / Pino",

    value: "finger_pino",
  },

  {
    label: "Finger / Cedro",

    value: "finger_cedro",
  },

  {
    label: "Cedro / Cedro",

    value: "cedro_cedro",
  },
];

export const MODELOS_MARCO_15: {
  label: string;

  value: PuertasPlacaModelo;
}[] = [
  {
    label: "Finger / Pino",

    value: "finger_pino",
  },

  {
    label: "Finger / Cedro",

    value: "finger_cedro",
  },

  {
    label: "Cedro / Pino",

    value: "cedro_pino",
  },

  {
    label: "Cedro / Cedro",

    value: "cedro_cedro",
  },
];

export const MODELOS_ALUMINIO: {
  label: string;

  value: PuertasPlacaModelo;
}[] = [
  {
    label: "Aluminio / Pino",

    value: "aluminio_pino",
  },

  {
    label: "Aluminio / Cedro",

    value: "aluminio_cedro",
  },
];
