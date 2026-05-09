export const coloresVentana = [
  {
    nombre: "Blanco",
    clase: "bg-white",
  },

  {
    nombre: "Negro",
    clase: "bg-black",
  },

  {
    nombre: "Bronce Colonial",
    clase: "bg-amber-700",
  },

  {
    nombre: "Simil Madera",
    clase: "bg-orange-900",
  },
] as const;

export const LIMITES_LINEA = {
  Herrero: {
    anchoMin: 50,
    anchoMax: 200,

    altoMin: 50,
    altoMax: 200,
  },

  Modena: {
    anchoMin: 60,
    anchoMax: 300,

    altoMin: 60,
    altoMax: 260,
  },
};
