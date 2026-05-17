import type { VentanaConfig } from "../types";

export function buildVentanaDescription(config: VentanaConfig) {
  return `
    Ventana ${config.ancho}x${config.alto}
    ${config.linea}
    ${config.color}
    ${config.guia ? "c/guía" : ""}
    ${config.mosquitero ? "c/mosq" : ""}
    ${config.cajonBlock ? "c/cajón block" : ""}
    ${config.cortina === "pvc" ? "PVC" : ""}
    ${config.cortina === "aluminio" ? "cortina aluminio" : ""}
    ${config.premarco ? "c/premarco" : ""}
    ${config.contramarco ? "c/contramarco" : ""}
    vidrio ${config.tipoVidrio || "4mm"}
  `
    .replace(/\s+/g, " ")
    .trim();
}
