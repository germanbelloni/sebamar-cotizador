import type { ProductUI } from "@/shared/types/ui";

export const PUERTAS_UI: ProductUI = {
  title: "Puertas",

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
        value: "herrero",
      },

      {
        label: "Modena",
        value: "modena",
      },

      {
        label: "Eco",
        value: "eco",
      },
    ],

    tipos: [
      {
        label: "Simple",
        value: "simple",
      },

      {
        label: "Doble",
        value: "doble",
      },

      {
        label: "Puerta y media",
        value: "puerta_y_media",
      },
    ],
  },

  messages: {
    invalidMeasures: "Las medidas ingresadas no son válidas.",

    quotationError: "Ocurrió un error al cotizar la puerta.",

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
