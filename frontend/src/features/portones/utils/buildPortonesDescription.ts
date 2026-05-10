import type { PortonesConfig } from "../types";

export function buildPortonesDescription(config: PortonesConfig) {
  return `
Portón ${config.sistema}
${config.linea}
${config.ancho}x${config.alto}
${config.color}
  `.trim();
}
