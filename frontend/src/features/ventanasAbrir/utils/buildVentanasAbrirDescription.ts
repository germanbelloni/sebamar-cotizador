import type { VentanasAbrirConfig } from "../types";

export function buildVentanasAbrirDescription(config: VentanasAbrirConfig) {
  return `
    Ventana de abrir
    ${config.ancho}x${config.alto}
    aluminio
    ${config.color}
    ${config.linea}
    vidrio ${config.tipoVidrio || "4mm"}
    ${config.bisagra ? `bisagra ${config.bisagra}` : ""}
    ${config.mosquitero ? "c/mosquitero" : ""}
    ${config.premarco ? "c/premarco" : ""}
    ${config.contramarco ? "c/contramarco" : ""}
    ${config.herrajesBlancos ? "herrajes blancos" : ""}
  `
    .replace(/\s+/g, " ")
    .trim();
}
