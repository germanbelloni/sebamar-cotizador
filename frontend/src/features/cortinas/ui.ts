export const cortinas_UI = {
  title: "Cortinas",

  sections: {
    sistema: "Sistema",
    medidas: "Medidas",
    construccion: "Construcción",
    material: "Material",
    calidad: "Calidad",
  },

  actions: {
    addToBudget: "Agregar al presupuesto",
  },

  messages: {
    invalidMeasures: "Las medidas ingresadas son inválidas.",
    reviewLimits: "Revisá los límites permitidos.",
    quotationError: "No se pudo cotizar la cortina.",
  },

  selectors: {
    tipos: [
      {
        label: "Cortina",
        value: "cortina",
      },
      {
        label: "Cajón Block",
        value: "cajon_block",
      },
    ],

    materiales: [
      {
        label: "PVC",
        value: "pvc",
      },
      {
        label: "Aluminio",
        value: "aluminio",
      },
    ],

    construcciones: [
      {
        label: "Completa",
        value: "completa",
      },
      {
        label: "Paño Solo",
        value: "pano_solo",
      },
    ],

    calidadesPVC: [
      {
        label: "Liviana",
        value: "liviana",
      },
      {
        label: "Reforzada",
        value: "reforzada",
      },
      {
        label: "Súper Reforzada",
        value: "super_reforzada",
      },
    ],

    coloresPVC: [
      {
        label: "Blanco",
        value: "blanco",
        colorClass: "bg-white",
      },
    ],

    coloresAluminio: [
      {
        label: "Blanco",
        value: "blanco",
      },
      {
        label: "Simil Madera",
        value: "simil_madera",
      },
    ],
  },
};
