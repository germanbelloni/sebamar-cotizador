import type { ProductUI } from "@/shared/types/ui";

export const PATAGONICAS_UI: ProductUI = {
  title: "Patagónicas",

  sections: {
    sistema: "Sistema",

    medidas: "Medidas",

    vidrio: "Vidrio",

    extras: "Extras",
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

    tipos: [
      {
        label: "1 Raja",
        value: "1_raja",
      },

      {
        label: "2 Rajas",
        value: "2_rajas",
      },
    ],

    medidasRaja: [
      {
        label: "40 cm",
        value: "40",
      },

      {
        label: "50 cm",
        value: "50",
      },

      {
        label: "60 cm",
        value: "60",
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

  messages: {
    invalidMeasures: "Las medidas ingresadas no son válidas.",

    quotationError: "Ocurrió un error al cotizar la patagónica.",

    reviewLimits: "Revisá las medidas antes de agregar al presupuesto.",
  },

  actions: {
    addToBudget: "Agregar al presupuesto",

    quoting: "Cotizando...",
  },
};
