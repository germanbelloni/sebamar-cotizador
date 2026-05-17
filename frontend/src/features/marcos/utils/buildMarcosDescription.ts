import type { MarcosConfig } from "../types";

export function buildMarcosDescription(config: MarcosConfig) {
  let description = "";

  if (config.tipo === "premarco") {
    description = `Premarco ${config.ancho}x${config.alto}`;
  }

  if (config.tipo === "contramarco") {
    description = `Contramarco ${config.ancho}x${config.alto}`;

    if (config.color && config.color !== "blanco") {
      description += ` ${config.color}`;
    }
  }

  return description;
}
