import type { MosquiterosConfig, MosquiteroTipo } from "./types";
export const LIMITES_MOSQUITEROS = {
  ventana: {
    anchoMin: 60,
    anchoMax: 240,

    altoMin: 40,
    altoMax: 210,
  },

  puerta_mosquitera: {
    anchoMin: 70,
    anchoMax: 100,

    altoMin: 180,
    altoMax: 210,
  },

  fijo: {
    anchoMin: 30,
    anchoMax: 240,

    altoMin: 20,
    altoMax: 240,
  },
};

export const tiposMosquitero = [
  {
    label: "Para ventana",
    value: "ventana",
  },

  {
    label: "Puerta mosquitera",
    value: "puerta_mosquitera",
  },

  {
    label: "Fijo",
    value: "fijo",
  },
] as const;
export const initialMosquiterosConfig: MosquiterosConfig = {
  ancho: 100,

  alto: 100,

  tipo: "ventana",

  color: "blanco",

  ladoBisagra: "derecha",
};

export function getDefaultMosquiteroMeasures(tipo: MosquiteroTipo) {
  switch (tipo) {
    case "puerta_mosquitera":
      return {
        ancho: 80,
        alto: 200,
      };

    case "fijo":
      return {
        ancho: 100,
        alto: 100,
      };

    case "ventana":
    default:
      return {
        ancho: 100,
        alto: 100,
      };
  }
}
