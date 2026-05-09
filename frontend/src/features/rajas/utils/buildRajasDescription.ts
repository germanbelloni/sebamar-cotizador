import type { RajasConfig } from "../types";

export function buildRajasDescription(config: RajasConfig) {
  return `
    Raja
    ${config.linea}
    ${config.modelo}
    ${config.ancho}x${config.alto}
    ${config.color}
    vidrio ${config.tipoVidrio || config.vidrio || "4mm"}
    ${config.mosquitero ? "c/mosquitero" : ""}
    ${config.premarco ? "c/premarco" : ""}
    ${config.contramarco ? "c/contramarco" : ""}
    ${config.herrajesBlancos ? "herrajes blancos" : ""}
  `
    .replace(/\s+/g, " ")
    .trim();
}
