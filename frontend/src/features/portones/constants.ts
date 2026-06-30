import type { PortonesConfig } from "./types";

export const LIMITES_PORTONES = {
  Herrero: {
    anchoMin: 200,
    anchoMax: 500,
    altoMin: 150,
    altoMax: 240,
  },

  Modena: {
    anchoMin: 200,
    anchoMax: 500,
    altoMin: 150,
    altoMax: 240,
  },
} as const;

export const MEDIDAS_STANDARD_PORTONES = [
  {
    label: "210 x 200",
    ancho: 210,
    alto: 200,
    hojas: 3 as const,
  },
  {
    label: "240 x 200",
    ancho: 240,
    alto: 200,
    hojas: 3 as const,
  },
  {
    label: "270 x 200",
    ancho: 270,
    alto: 200,
    hojas: 3 as const,
  },
];

export const HOJAS_DISPONIBLES = [3, 4, 5, 6] as const;

export const initialPortonesConfig: PortonesConfig = {
  ancho: 240,
  alto: 200,

  linea: "Herrero",

  sistema: "abrir",

  hojas: 3,

  mano: "izquierda",
  hojaPrincipal: 1,

  modelo: "modelo 1",

  color: "blanco",

  tipoVidrio: "4mm",

  extras: {
    barralRecto: 0,
    barralCurvo: 0,
    picaporte: false,
    mediaManija: false,
    dobleTravesano: false,
    cartelprohibido: false,
  },
};
