import type { MarcosConfig } from "../types";

export function buildMarcosDescription(config: MarcosConfig) {
  const parts: string[] = [];

  if (config.tipo === "premarco") {
    parts.push("Premarco");
  }

  if (config.tipo === "contramarco") {
    parts.push("Contramarco");
  }

  parts.push("aluminio");

  parts.push(config.color || "blanco");

  parts.push("para");

  parts.push(`${config.ancho}x${config.alto}`);

  return parts.join(" ");
}
