export const MOSQUITEROS_UI = {
  title: "Mosquiteros",

  sections: {
    tipo: "Tipo",

    medidas: "Medidas",

    color: "Color",
  },

  selectors: {
    tipos: [
      {
        value: "ventana",

        label: "Ventana",
      },

      {
        value: "puerta_mosquitera",

        label: "Puerta mosquitera",
      },
    ],
  },

  messages: {
    invalidMeasures: "Las medidas ingresadas no son válidas.",

    quotationError: "Ocurrió un error al cotizar.",

    reviewLimits: "Revisá los límites permitidos.",
  },

  actions: {
    addToBudget: "Agregar al presupuesto",
  },
};
