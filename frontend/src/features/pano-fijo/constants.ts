import type { PanoFijoLinea } from "./types";
import type { PanoFijoConfig } from "./types";

export const LIMITES_PANO_FIJO = {
  anchoMin: 30,
  anchoMax: 300,
  altoMin: 30,
  altoMax: 250,
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

export const VIDRIOS_PANO_FIJO = [
  { label: "3mm", value: "3mm" },
  { label: "4mm", value: "4mm" },
  { label: "5mm", value: "5mm" },
  { label: "Fantasía", value: "fantasia" },
  { label: "Esmerilado", value: "esmerilado" },
  { label: "3+3", value: "3+3" },
  { label: "4+4", value: "4+4" },
  { label: "DVH 4+9+4", value: "dvh_4_9_4" },
  { label: "DVH 5+9+5", value: "dvh_5_9_5" },
];
export const initialPanoFijoConfig: PanoFijoConfig = {
  ancho: 150,

  alto: 150,

  linea: "herrero",

  color: "blanco",

  tipoVidrio: "4mm",

  travesanoVertical: false,
  travesanoHorizontal: false,
};
