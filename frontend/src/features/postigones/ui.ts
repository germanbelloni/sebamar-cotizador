import type { ProductUI } from "@/shared/types/ui";

export const POSTIGONES_UI: ProductUI = {
  title: "Postigones",

  sections: {
    tipo: "Tipo",

    medidas: "Medidas",

    extras: "Extras",
  },

  selectors: {
    tipos: [
      {
        label: "Abrir",
        value: "abrir",
      },

      {
        label: "Corredizo",
        value: "corredizo",
      },
    ],
  },

  messages: {
    invalidMeasures: "Las medidas ingresadas no son válidas.",

    quotationError: "Ocurrió un error al cotizar el postigón.",

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

      section: "tipo",

      selectorKey: "tipos",
    },

    {
      id: "dimensions",

      type: "dimensions",

      section: "medidas",
    },
  ],
};
