export const LIMITES_POSTIGONES = {
  anchoMin: 60,
  anchoMax: 240,

  altoMin: 60,
  altoMax: 210,
};

export const coloresPostigones = [
  {
    label: "Blanco",
    value: "blanco",

    clase: "bg-white",
  },

  {
    label: "Negro",
    value: "negro",

    clase: "bg-black",
  },

  {
    label: "Bronce Colonial",
    value: "bronce colonial",

    clase: "bg-amber-700",
  },

  {
    label: "Simil Madera",
    value: "simil madera",

    clase: "bg-orange-900",
  },
] as const;
