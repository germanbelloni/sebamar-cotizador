export type PuertaModeloKey =
  | "m1"
  | "m1vr"
  | "m2"
  | "m3"
  | "m3vr"
  | "m4"
  | "m4vr"
  | "m5"
  | "m6"
  | "m7"
  | "m8"
  | "m9"
  | "m10"
  | "m10vr"
  | "m11"
  | "m12"
  | "mpanel";

export type GlassArea = {
  x: number;

  y: number;

  width: number;

  height: number;

  radius?: number;
};

export type Travesano = {
  y: number;

  height: number;
};

export type PuertaModeloConfig = {
  key: PuertaModeloKey;

  label: string;

  hasGlass: boolean;

  glassAreas?: GlassArea[];

  travesanos?: Travesano[];

  verticalDivisions?: number[];

  bottomPanel?: boolean;

  imageHotspot?: {
    x: number;

    y: number;

    width: number;

    height: number;
  };
};

export const MODELOS_PUERTAS: Record<PuertaModeloKey, PuertaModeloConfig> = {
  m1: {
    key: "m1",

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

  m1vr: {
    key: "m1vr",

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

  m2: {
    key: "m2",

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

  m3: {
    key: "m3",

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

  m3vr: {
    key: "m3vr",

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

  m4: {
    key: "m4",

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

  m4vr: {
    key: "m4vr",

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

  m5: {
    key: "m5",

    label: "Modelo 5",

    hasGlass: false,
  },

  m6: {
    key: "m6",

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

  m7: {
    key: "m7",

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

  m8: {
    key: "m8",

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

  m9: {
    key: "m9",

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

  m10: {
    key: "m10",

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

  m10vr: {
    key: "m10vr",

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

  m11: {
    key: "m11",

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

  m12: {
    key: "m12",

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

  mpanel: {
    key: "mpanel",

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
