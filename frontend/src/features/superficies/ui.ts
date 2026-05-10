import type { ProductUI } from "@/shared/types/ui";

export const SUPERFICIES_UI: ProductUI = {
  title: "Superficies",

  sections: {
    sistema: "Sistema",

    medidas: "Medidas",

    vidrio: "Vidrio",
  },

  selectors: {
    tipos: [
      {
        label: "Paño fijo",
        value: "pano_fijo",
      },

      {
        label: "Premarco",
        value: "premarco",
      },

      {
        label: "Contramarco",
        value: "contramarco",
      },
    ],

    lineas: [
      {
        label: "Herrero",
        value: "herrero",
      },

      {
        label: "Modena",
        value: "modena",
      },
    ],
  },

  messages: {
    invalidMeasures: "Las medidas ingresadas no son válidas.",

    quotationError: "Ocurrió un error al cotizar la superficie.",

    reviewLimits: "Revisá las medidas antes de agregar al presupuesto.",
  },

  actions: {
    addToBudget: "Agregar al presupuesto",

    quoting: "Cotizando...",
  },

  fields: [
    {
      id: "tipo",

      type: "selector",

      section: "sistema",

      selectorKey: "tipos",
    },

    {
      id: "linea",

      type: "selector",

      section: "sistema",

      selectorKey: "lineas",
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
