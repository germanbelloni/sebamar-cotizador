import type { ProductUI } from "@/shared/types/ui";
import type { FormField } from "@/shared/types/form";
export const VENTANAS_UI: ProductUI = {
  title: "Ventanas",

  sections: {
    sistema: "Sistema",

    medidas: "Medidas",

    colores: "Color",

    extras: "Extras",

    cortinas: "Cortinas",

    modena: "Utilidades",
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
  },

  defaults: {
    vidrio: "4mm",

    color: "blanco",
  },

  messages: {
    invalidMeasures:
      "Las medidas ingresadas no son válidas para la línea seleccionada.",

    reviewLimits:
      "Revisá los límites permitidos antes de agregar al presupuesto.",

    quotationError: "Ocurrió un error al cotizar la ventana.",
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
      id: "dimensions",

      type: "dimensions",

      section: "medidas",
    },

    {
      id: "color",

      type: "color-selector",

      section: "colores",
    },
  ] satisfies FormField[],
};
