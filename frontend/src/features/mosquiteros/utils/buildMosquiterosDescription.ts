import type { MosquiterosConfig } from "../types";

export function buildMosquiterosDescription(config: MosquiterosConfig) {
  const tipo =
    config.tipo === "ventana"
      ? "Mosquitero Ventana"
      : config.tipo === "fijo"
        ? "Mosquitero Fijo"
        : "Puerta Mosquitera";

  return [
    tipo,

    `${config.ancho}x${config.alto}`,

    config.color,

    config.tipo === "puerta_mosquitera"
      ? `Bisagra ${config.ladoBisagra}`
      : null,
  ]
    .filter(Boolean)
    .join(" · ");
}
