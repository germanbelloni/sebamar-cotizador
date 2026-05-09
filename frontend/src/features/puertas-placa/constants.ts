export const LIMITES_PUERTAS_PLACA = {
  anchoMin: 60,
  anchoMax: 100,

  altoMin: 150,
  altoMax: 210,
};

export const tiposPuertaPlaca = [
  {
    label: "Placa",
    value: "placa",
  },

  {
    label: "Embutir",
    value: "embutir",
  },
] as const;

export const modelosPuertaPlaca = [
  {
    label: "Finger Pino",
    value: "finger_pino",
  },

  {
    label: "Pino Cedro",
    value: "pino_cedro",
  },

  {
    label: "Cedro Cedro",
    value: "cedro_cedro",
  },

  {
    label: "Aluminio Pino",
    value: "aluminio_pino",
  },

  {
    label: "Aluminio Cedro",
    value: "aluminio_cedro",
  },

  {
    label: "Finger Cedro",
    value: "finger_cedro",
  },
] as const;

export const marcosPuertaPlaca = [
  {
    label: "Marco 10",
    value: "marco_10",
  },

  {
    label: "Marco 15",
    value: "marco_15",
  },

  {
    label: "Aluminio",
    value: "aluminio",
  },
] as const;
