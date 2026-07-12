import type { CortinaConfig } from "../types";

export function createCortinaPayload(config: CortinaConfig) {
  if (config.tipo === "cajon_block") {
    return {
      tipo: "cajon_block",
      material: config.material,
      ancho: config.ancho,
      alto: config.alto,
    };
  }

  if (config.material === "pvc") {
    return {
      tipo: "cortina",
      material: "pvc",
      construccion: config.construccion,
      calidad: config.calidad,
      ancho: config.ancho,
      alto: config.alto,
    };
  }

  return {
    tipo: "cortina",
    material: "aluminio",
    construccion: config.construccion,
    color: config.color,
    ancho: config.ancho,
    alto: config.alto,
  };
}
