import type { PuertasConfig } from "./types";
import type {
  PuertaLinea,
  PuertaTipoConfiguracion,
  PuertaTipoPorton,
  PuertaVidrio,
} from "./types";

/* ========================= */
/* LINEAS */
/* ========================= */

export const PUERTAS_LINEAS: {
  label: string;
  value: PuertaLinea;
}[] = [
  {
    label: "Herrero",
    value: "herrero",
  },

  {
    label: "Módena",
    value: "modena",
  },

  {
    label: "Eco",
    value: "eco",
  },
];

/* ========================= */
/* TIPOS */
/* ========================= */

export const PUERTAS_TIPOS: {
  label: string;
  value: PuertaTipoConfiguracion;
}[] = [
  {
    label: "Puerta",
    value: "simple",
  },

  {
    label: "Puerta y media",
    value: "puerta_y_media",
  },

  {
    label: "Puerta doble",
    value: "doble",
  },

  {
    label: "Portón",
    value: "porton",
  },
];

/* ========================= */
/* TIPOS PORTON */
/* ========================= */

export const TIPOS_PORTON: {
  label: string;
  value: PuertaTipoPorton;
}[] = [
  {
    label: "De abrir",
    value: "abrir",
  },

  {
    label: "Plegadizo",
    value: "plegadizo",
  },

  {
    label: "Corredizo",
    value: "corredizo",
  },
];

/* ========================= */
/* PRESETS */
/* ========================= */

export const PRESETS_PUERTAS = {
  simple: [
    {
      label: "70 × 200",
      ancho: 70,
      alto: 200,
    },

    {
      label: "80 × 200",
      ancho: 80,
      alto: 200,
    },

    {
      label: "90 × 200",
      ancho: 90,
      alto: 200,
    },

    {
      label: "Fuera de medida",
      ancho: 85,
      alto: 205,
      custom: true,
    },
  ],

  puerta_y_media: [
    {
      label: "110 × 200",
      ancho: 110,
      alto: 200,
      principal: 70,
    },

    {
      label: "120 × 200",
      ancho: 120,
      alto: 200,
      principal: 80,
    },

    {
      label: "130 × 200",
      ancho: 130,
      alto: 200,
      principal: 90,
    },

    {
      label: "Fuera de medida",
      ancho: 125,
      alto: 205,
      principal: 80,
      custom: true,
    },
  ],

  doble: [
    {
      label: "140 × 200",
      ancho: 140,
      alto: 200,
    },

    {
      label: "160 × 200",
      ancho: 160,
      alto: 200,
    },

    {
      label: "180 × 200",
      ancho: 180,
      alto: 200,
    },

    {
      label: "Fuera de medida",
      ancho: 170,
      alto: 205,
      custom: true,
    },
  ],

  porton: [
    {
      label: "210 × 200",
      ancho: 210,
      alto: 200,
    },

    {
      label: "240 × 200",
      ancho: 240,
      alto: 200,
    },

    {
      label: "270 × 200",
      ancho: 270,
      alto: 200,
    },

    {
      label: "Fuera de medida",
      ancho: 260,
      alto: 210,
      custom: true,
    },
  ],
};

/* ========================= */
/* MODELOS */
/* ========================= */

export const MODELOS_PUERTAS = {
  herrero: [
    "modelo_1",
    "modelo_1_vr",
    "modelo_2",
    "modelo_3",
    "modelo_3_vr",
    "modelo_4",
    "modelo_4_vr",
    "modelo_5",
    "modelo_6",
    "modelo_7",
    "modelo_8",
    "modelo_9",
    "modelo_10",
    "modelo_10_vr",
    "modelo_11",
    "modelo_12",
    "modelo_panel",
  ],

  modena: [
    "modelo_1",
    "modelo_1_vr",
    "modelo_2",
    "modelo_3",
    "modelo_3_vr",
    "modelo_4",
    "modelo_4_vr",
    "modelo_5",
    "modelo_6",
    "modelo_7",
    "modelo_8",
    "modelo_9",
    "modelo_10",
    "modelo_10_vr",
    "modelo_11",
    "modelo_12",
    "modelo_c_panel",
  ],

  eco: [
    "modelo_1_vr",
    "modelo_2",
    "modelo_3",
    "modelo_3vr",
    "modelo_4",
    "modelo_4_vr",
    "modelo_5",
  ],
};

/* ========================= */
/* VIDRIOS */
/* ========================= */

export const VIDRIOS_POR_LINEA: Record<PuertaLinea, PuertaVidrio[]> = {
  herrero: ["3mm", "4mm", "5mm", "fantasia", "esmerilado", "3+3"],

  modena: ["3mm", "4mm", "5mm", "fantasia", "esmerilado", "3+3", "dvh_4_9_4"],

  eco: ["3mm", "4mm", "fantasia"],
};

/* ========================= */
/* INITIAL CONFIG */
/* ========================= */

export const initialPuertasConfig: PuertasConfig = {
  ancho: 80,
  alto: 200,

  linea: "herrero",

  tipoConfiguracion: "simple",
  tipoPorton: "abrir",

  modelo: "modelo_4",
  modeloMediaPuerta: "v_entero",

  color: "blanco",

  mano: "derecha",

  // Solo aplica a portón
  hojaPrincipal: 1,

  hojas: 1,
  anchoPrincipal: 80,

  vidrio: "3mm",

  extras: {
    barralRecto: 0,
    barralCurvo: 0,
    picaporte: false,
  },
};
