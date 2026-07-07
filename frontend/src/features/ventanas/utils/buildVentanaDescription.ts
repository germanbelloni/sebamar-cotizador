import type { VentanaConfig } from "../types";

export function buildVentanaDescription(config: VentanaConfig) {
  const extras = [
    config.guia && "c/guía",
    config.cajonBlock && "c/cajón block",
    config.cortina === "pvc" && "PVC",
    config.cortina === "aluminio" && "cortina aluminio",
    config.mosquitero && "c/mosq",
    config.premarco && "c/premarco",
    config.contramarco && "c/contramarco",
  ]
    .filter(Boolean)
    .join(" ");

  return `
    Ventana
    ${config.ancho}x${config.alto}
    aluminio
    ${config.color}
    ${config.linea}
    vidrio ${config.tipoVidrio || "4mm"}
    ${extras}
  `
    .replace(/\s+/g, " ")
    .trim();
}
