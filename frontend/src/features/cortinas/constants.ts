import type {
  CalidadPVC,
  ColorAluminio,
  ConstruccionCortina,
  CortinaConfig,
  MaterialCortina,
  TipoCortina,
} from "./types";

export const LIMITES_CORTINAS = {
  anchoMin: 80,
  anchoMax: 240,
  altoMin: 50,
  altoMax: 220,
};

export const TIPOS_CORTINA: {
  value: TipoCortina;
  label: string;
}[] = [
  {
    value: "cortina",
    label: "Cortina",
  },
  {
    value: "cajon_block",
    label: "Cajón Block",
  },
];

export const MATERIALES_CORTINA: {
  value: MaterialCortina;
  label: string;
}[] = [
  {
    value: "pvc",
    label: "PVC",
  },
  {
    value: "aluminio",
    label: "Aluminio",
  },
];

export const CONSTRUCCIONES_CORTINA: {
  value: ConstruccionCortina;
  label: string;
}[] = [
  {
    value: "completa",
    label: "Completa",
  },
  {
    value: "pano_solo",
    label: "Paño Solo",
  },
];

export const CALIDADES_PVC: {
  value: CalidadPVC;
  label: string;
}[] = [
  {
    value: "liviana",
    label: "Liviana",
  },
  {
    value: "reforzada",
    label: "Reforzada",
  },
  {
    value: "super_reforzada",
    label: "Súper Reforzada",
  },
];

export const COLORES_ALUMINIO: {
  value: ColorAluminio;
  label: string;
}[] = [
  {
    value: "blanco",
    label: "Blanco",
  },
  {
    value: "simil_madera",
    label: "Simil Madera",
  },
];

export const initialCortinaConfig: CortinaConfig = {
  tipo: "cortina",

  material: "pvc",

  construccion: "completa",

  calidad: "reforzada",

  color: "blanco",

  ancho: 120,
  alto: 150,
};
