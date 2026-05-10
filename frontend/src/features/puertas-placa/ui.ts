import type { ProductUI } from "@/shared/types/ui";

export const PUERTAS_PLACA_UI: ProductUI = {
  title: "Puertas Placa",

  sections: {
    medidas: "Medidas",
  },

  messages: {
    invalidMeasures: "Las medidas ingresadas no son válidas.",

    quotationError: "Ocurrió un error al cotizar.",

    reviewLimits: "Revisá las medidas antes de agregar al presupuesto.",
  },

  actions: {
    addToBudget: "Agregar al presupuesto",

    quoting: "Cotizando...",
  },

  defaults: {
    color: "blanco",
  },

  fields: [
    {
      id: "dimensions",

      type: "dimensions",

      section: "medidas",
    },
  ],
};
