export const VENTANAS_UI = {
  title: "Ventanas",

  sections: {
    sistema: "Sistema",

    medidas: "Medidas",

    colores: "Color",

    extras: "Extras",

    cortinas: "Cortinas",

    modena: "Modena",
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
};
