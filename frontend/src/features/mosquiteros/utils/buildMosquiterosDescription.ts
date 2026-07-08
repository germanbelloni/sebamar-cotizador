import type { MosquiterosConfig } from "../types";

export function buildMosquiterosDescription(config: MosquiterosConfig) {
  const parts: string[] = [];

  // CORREDIZO
  if (config.tipo === "ventana") {
    parts.push("Mosquitero corredizo");
    parts.push("para ventana");
    parts.push("de");
    parts.push(`${config.ancho}x${config.alto}`);
    parts.push("aluminio");
    parts.push(config.color);

    return parts.join(" ");
  }

  // FIJO
  if (config.tipo === "fijo") {
    parts.push("Mosquitero fijo");
    parts.push(`${config.ancho}x${config.alto}`);
    parts.push("aluminio");
    parts.push(config.color);

    return parts.join(" ");
  }

  // PUERTA MOSQUITERA
  parts.push("Puerta mosquitera");
  parts.push(`${config.ancho}x${config.alto}`);
  parts.push("aluminio");
  parts.push(config.color);

  if (config.ladoBisagra) {
    parts.push(`bisagra ${config.ladoBisagra}`);
  }

  return parts.join(" ");
}
