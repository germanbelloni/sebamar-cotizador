export const FEATURES = [
  {
    id: "rajas",

    label: "Rajas",
  },

  {
    id: "ventanas",

    label: "Ventanas",
  },

  {
    id: "puertas",

    label: "Puertas",
  },

  {
    id: "puertas-placa",

    label: "Puertas placa",
  },

  {
    id: "postigones",

    label: "Postigones",
  },

  {
    id: "patagonicas",

    label: "Patagónicas",
  },

  {
    id: "superficies",

    label: "Superficies",
  },

  {
    id: "mosquiteros",

    label: "Mosquiteros",
  },

  {
    id: "portones",

    label: "Portones",
  },
] as const;

export function getFeatureLabel(featureId: string) {
  return (
    FEATURES.find((feature) => feature.id === featureId)?.label || "Sistema"
  );
}
