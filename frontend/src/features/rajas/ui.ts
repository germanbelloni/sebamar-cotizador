import type { VidrioType } from "@/shared/types/vidrios";

export const RAJAS_UI = {
  title: "Rajas",

  sections: {
    sistema: "Sistema",

    medidas: "Medidas",

    vidrio: "Vidrio",

    extras: "Extras",

    colores: "Color",
  },

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

  vidrios: [
    "3mm",

    "4mm",

    "5mm",

    "fantasia",

    "esmerilado",

    "3+3",
  ] as VidrioType[],
};
