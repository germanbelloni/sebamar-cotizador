export const VENTANAS_ABRIR_UI = {
  title: "Ventanas de Abrir",

  sections: {
    sistema: "Sistema",

    medidas: "Medidas",

    vidrio: "Vidrio",

    extras: "Extras",

    colores: "Color",
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

    bisagras: [
      {
        label: "Izquierda",
        value: "izquierda",
      },

      {
        label: "Derecha",
        value: "derecha",
      },
    ],
  },

  vidrios: [
    { label: "3 mm", value: "3mm" },
    { label: "4 mm", value: "4mm" },
    { label: "5 mm", value: "5mm" },
    { label: "Fantasía", value: "fantasia" },
    { label: "Esmerilado", value: "esmerilado" },
    { label: "3+3", value: "3+3" },
    { label: "4+4", value: "4+4" },
    { label: "DVH 4+9+4", value: "dvh" },
    { label: "DVH 5+9+5", value: "dvh_5_9_5" },
  ],

  messages: {
    invalidMeasures: "Las medidas están fuera de los límites permitidos.",

    quotationError: "Ocurrió un error al calcular la cotización.",

    reviewLimits: "Revisá las medidas ingresadas.",
  },

  actions: {
    addToBudget: "Agregar al presupuesto",
  },
};
