import type { VidrioType } from "@/shared/types/vidrios";

export const RAJAS_UI = {
  title: "Rajas",

  sections: {
    sistema: "Sistema",

    medidas: "Medidas",

    vidrio: "Vidrio",

    extras: "Extras",

    colores: "Color",

    apertura: "Apertura",
  },

  selectors: {
    lineas: [
      {
        label: "Herrero",
        value: "Herrero",
      },

      {
        label: "Modena",
        value: "Modena",
      },
    ],

    aperturas: [
      {
        label: "Abrir",
        value: "abrir",
      },

      {
        label: "Brazo",
        value: "brazo",
      },

      {
        label: "Volcable",
        value: "volcable",
      },

      {
        label: "Oscilobatiente",
        value: "oscilobatiente",
      },
    ],

    bisagras: [
      {
        label: "Izquierda",
        value: "izquierda",
      },

      {
        label: "Derecha",
        value: "derecha",
      },
    ],
  },

  vidrios: [
    "3mm",

    "4mm",

    "5mm",

    "fantasia",

    "esmerilado",

    "3+3",
  ] as VidrioType[],

  messages: {
    invalidMeasures: "Las medidas están fuera de los límites permitidos.",

    quotationError: "Ocurrió un error al calcular la cotización.",

    reviewLimits: "Revisá las medidas ingresadas.",
  },

  actions: {
    addToBudget: "Agregar al presupuesto",
  },
};
