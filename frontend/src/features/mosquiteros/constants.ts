export const LIMITES_MOSQUITEROS = {
  ventana: {
    anchoMin: 40,
    anchoMax: 200,

    altoMin: 40,
    altoMax: 200,
  },

  puerta: {
    anchoMin: 70,
    anchoMax: 100,

    altoMin: 180,
    altoMax: 210,
  },
};

export const tiposMosquitero = [
  {
    label: "Ventana",
    value: "ventana",
  },

  {
    label: "Puerta",
    value: "puerta",
  },
] as const;
