import type { ProductUI } from "@/shared/types/ui";

export const MARCOS_UI: ProductUI = {
  title: "Premarco / Contramarco",

  sections: {
    tipo: "Tipo",

    medidas: "Medidas",

    color: "Color",
  },

  messages: {
    invalidMeasures: "Las medidas ingresadas no son válidas.",

    quotationError: "Ocurrió un error al cotizar.",

    reviewLimits: "Revisá las medidas antes de agregar.",
  },

  actions: {
    addToBudget: "Agregar al presupuesto",

    quoting: "Cotizando...",
  },
};
