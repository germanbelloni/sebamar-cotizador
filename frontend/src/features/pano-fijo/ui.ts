import type { ProductUI } from "@/shared/types/ui";

export const PANO_FIJO_UI: ProductUI = {
  title: "Paño fijo",

  sections: {
    sistema: "Sistema",

    medidas: "Medidas",

    vidrio: "Vidrio",

    colores: "Color",
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
};
