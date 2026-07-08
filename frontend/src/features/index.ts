export const FEATURES = [
  {
    id: "ventanas",

    label: "Ventanas",
  },

  {
    id: "rajas",
    label: "Rajas",
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
    id: "mosquiteros",

    label: "Mosquiteros",
  },

  {
    id: "pano-fijo",

    label: "Paño fijo",
  },

  {
    id: "marcos",

    label: "Premarco / Contramarco",
  },
  {
    id: "ventanas-abrir",

    label: "Ventanas de Abrir",
  },
] as const;

export function getFeatureLabel(featureId: string) {
  return (
    FEATURES.find((feature) => feature.id === featureId)?.label || "Sistema"
  );
}
