import type { PuertaModeloConfig } from "./types";

export const MODELOS_PUERTAS_CONFIG: Record<string, PuertaModeloConfig> = {
  modelo_1: {
    key: "modelo_1",

    label: "Modelo 1",

    hasGlass: true,

    glassAreas: [
      {
        x: 0.2,
        y: 0.08,
        width: 0.6,
        height: 0.78,
      },
    ],
  },

  modelo_1_vr: {
    key: "modelo_1_vr",

    label: "Modelo 1 VR",

    hasGlass: true,

    glassAreas: [
      {
        x: 0.2,
        y: 0.08,
        width: 0.6,
        height: 0.78,
      },
    ],

    verticalDivisions: [0.33, 0.66],
  },

  modelo_2: {
    key: "modelo_2",

    label: "Modelo 2",

    hasGlass: true,

    glassAreas: [
      {
        x: 0.2,
        y: 0.08,
        width: 0.6,
        height: 0.78,
      },
    ],

    travesanos: [
      {
        y: 0.32,
        height: 0.025,
      },

      {
        y: 0.62,
        height: 0.025,
      },
    ],
  },

  modelo_3: {
    key: "modelo_3",

    label: "Modelo 3",

    hasGlass: true,

    glassAreas: [
      {
        x: 0.18,
        y: 0.08,
        width: 0.64,
        height: 0.45,
      },
    ],

    bottomPanel: true,
  },

  modelo_3_vr: {
    key: "modelo_3_vr",

    label: "Modelo 3 VR",

    hasGlass: true,

    glassAreas: [
      {
        x: 0.18,
        y: 0.08,
        width: 0.64,
        height: 0.45,
      },
    ],

    verticalDivisions: [0.5],

    bottomPanel: true,
  },

  modelo_4: {
    key: "modelo_4",

    label: "Modelo 4",

    hasGlass: true,

    glassAreas: [
      {
        x: 0.22,
        y: 0.08,
        width: 0.56,
        height: 0.25,
      },
    ],

    bottomPanel: true,
  },

  modelo_4_vr: {
    key: "modelo_4_vr",

    label: "Modelo 4 VR",

    hasGlass: true,

    glassAreas: [
      {
        x: 0.22,
        y: 0.08,
        width: 0.56,
        height: 0.25,
      },
    ],

    verticalDivisions: [0.5],

    bottomPanel: true,
  },

  modelo_5: {
    key: "modelo_5",

    label: "Modelo 5",

    hasGlass: false,
  },

  modelo_6: {
    key: "modelo_6",

    label: "Modelo 6",

    hasGlass: true,

    glassAreas: [
      {
        x: 0.2,
        y: 0.12,
        width: 0.6,
        height: 0.52,
      },
    ],

    travesanos: [
      {
        y: 0.72,
        height: 0.03,
      },
    ],
  },

  modelo_7: {
    key: "modelo_7",

    label: "Modelo 7",

    hasGlass: true,

    glassAreas: [
      {
        x: 0.18,
        y: 0.1,
        width: 0.64,
        height: 0.18,
      },
    ],

    travesanos: [
      {
        y: 0.4,
        height: 0.025,
      },

      {
        y: 0.62,
        height: 0.025,
      },
    ],
  },

  modelo_8: {
    key: "modelo_8",

    label: "Modelo 8",

    hasGlass: true,

    glassAreas: [
      {
        x: 0.12,
        y: 0.18,
        width: 0.76,
        height: 0.18,
      },
    ],
  },

  modelo_9: {
    key: "modelo_9",

    label: "Modelo 9",

    hasGlass: true,

    glassAreas: [
      {
        x: 0.25,
        y: 0.08,
        width: 0.5,
        height: 0.18,
      },
    ],

    bottomPanel: true,
  },

  modelo_10: {
    key: "modelo_10",

    label: "Modelo 10",

    hasGlass: true,

    glassAreas: [
      {
        x: 0.32,
        y: 0.08,
        width: 0.36,
        height: 0.14,
      },
    ],

    bottomPanel: true,
  },

  modelo_10_vr: {
    key: "modelo_10_vr",

    label: "Modelo 10 VR",

    hasGlass: true,

    glassAreas: [
      {
        x: 0.32,
        y: 0.08,
        width: 0.36,
        height: 0.14,
      },
    ],

    verticalDivisions: [0.5],

    bottomPanel: true,
  },

  modelo_11: {
    key: "modelo_11",

    label: "Modelo 11",

    hasGlass: true,

    glassAreas: [
      {
        x: 0.18,
        y: 0.08,
        width: 0.64,
        height: 0.7,
      },
    ],

    verticalDivisions: [0.33, 0.66],
  },

  modelo_12: {
    key: "modelo_12",

    label: "Modelo 12",

    hasGlass: true,

    glassAreas: [
      {
        x: 0.18,
        y: 0.08,
        width: 0.64,
        height: 0.55,
      },
    ],

    travesanos: [
      {
        y: 0.7,
        height: 0.03,
      },
    ],
  },

  modelo_panel: {
    key: "modelo_panel",

    label: "Modelo Panel",

    hasGlass: false,

    travesanos: [
      {
        y: 0.2,
        height: 0.025,
      },

      {
        y: 0.4,
        height: 0.025,
      },

      {
        y: 0.6,
        height: 0.025,
      },

      {
        y: 0.8,
        height: 0.025,
      },
    ],
  },
};
