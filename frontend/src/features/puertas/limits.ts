import type { PuertaLinea, PuertaTipo } from "./types";

type Limites = {
  anchoMin: number;

  anchoMax: number;

  altoMin: number;

  altoMax: number;
};

export const LIMITES_PUERTAS: Record<
  PuertaLinea,
  Record<PuertaTipo, Limites>
> = {
  herrero: {
    simple: {
      anchoMin: 70,
      anchoMax: 100,

      altoMin: 190,
      altoMax: 210,
    },

    doble: {
      anchoMin: 140,
      anchoMax: 200,

      altoMin: 190,
      altoMax: 210,
    },

    puerta_y_media: {
      anchoMin: 110,
      anchoMax: 140,

      altoMin: 190,
      altoMax: 210,
    },

    porton: {
      anchoMin: 180,
      anchoMax: 320,

      altoMin: 190,
      altoMax: 260,
    },
  },

  modena: {
    simple: {
      anchoMin: 70,
      anchoMax: 100,

      altoMin: 190,
      altoMax: 210,
    },

    doble: {
      anchoMin: 140,
      anchoMax: 200,

      altoMin: 190,
      altoMax: 210,
    },

    puerta_y_media: {
      anchoMin: 110,
      anchoMax: 140,

      altoMin: 190,
      altoMax: 210,
    },

    porton: {
      anchoMin: 180,
      anchoMax: 320,

      altoMin: 190,
      altoMax: 260,
    },
  },

  eco: {
    simple: {
      anchoMin: 70,
      anchoMax: 100,

      altoMin: 190,
      altoMax: 210,
    },

    doble: {
      anchoMin: 140,
      anchoMax: 200,

      altoMin: 190,
      altoMax: 210,
    },

    puerta_y_media: {
      anchoMin: 110,
      anchoMax: 140,

      altoMin: 190,
      altoMax: 210,
    },

    porton: {
      anchoMin: 180,
      anchoMax: 320,

      altoMin: 190,
      altoMax: 260,
    },
  },
};
