import type { ProductUI } from "@/shared/types/ui";

export const PORTONES_UI: ProductUI = {
  title: "Portones",

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

    sistemas: [
      {
        label: "Corredizo",
        value: "corredizo",
      },

      {
        label: "Plegadizo",
        value: "plegadizo",
      },
    ],
  },

  messages: {
    invalidMeasures: "Las medidas ingresadas no son válidas.",

    quotationError: "Ocurrió un error al cotizar el portón.",

    reviewLimits: "Revisá los límites permitidos.",
  },

  actions: {
    addToBudget: "Agregar al presupuesto",

    quoting: "Cotizando...",
  },
};
