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
    id: "mosquiteros",

    label: "Mosquiteros",
  },

  {
    id: "portones",

    label: "Portones",
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
    id: "presupuestos",

    label: "Presupuestos",
  },
  {
    id: "configuracion",

    label: "Configuración",
  },
] as const;

export function getFeatureLabel(featureId: string) {
  return (
    FEATURES.find((feature) => feature.id === featureId)?.label || "Sistema"
  );
}
