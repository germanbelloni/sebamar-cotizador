import type { PanoFijoLinea, PanoFijoVidrio } from "./types";
import type { PanoFijoConfig } from "./types";

export const LIMITES_PANO_FIJO = {
  anchoMin: 20,

  anchoMax: 500,

  altoMin: 20,

  altoMax: 300,
};

export const LINEAS_PANO_FIJO: {
  label: string;

  value: PanoFijoLinea;
}[] = [
  {
    label: "Herrero",

    value: "herrero",
  },

  {
    label: "Modena",

    value: "modena",
  },
];

export const VIDRIOS_PANO_FIJO: {
  label: string;

  value: PanoFijoVidrio;
}[] = [
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

  {
    label: "DVH 4+9+4",

    value: "dvh_4_9_4",
  },
];
export const initialPanoFijoConfig: PanoFijoConfig = {
  ancho: 120,

  alto: 120,

  linea: "herrero",

  color: "blanco",

  tipoVidrio: "4mm",
};
