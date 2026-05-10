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

  fields: [
    {
      id: "linea",

      type: "selector",

      section: "sistema",

      selectorKey: "lineas",
    },

    {
      id: "tipo",

      type: "selector",

      section: "sistema",

      selectorKey: "tipos",
    },

    {
      id: "dimensions",

      type: "dimensions",

      section: "medidas",
    },

    {
      id: "vidrio",

      type: "glass-selector",

      section: "vidrio",
    },
  ],
};
