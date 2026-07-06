import type { VentanasAbrirConfig } from "../types";

function getModeloLabel(modelo: VentanasAbrirConfig["modelo"]) {
  switch (modelo) {
    case "brazo":
      return "Brazo de empuje";

    case "volcable":
      return "Volcable";

    case "oscilobatiente":
      return "Oscilobatiente";

    default:
      return "Ventana de abrir";
  }
}

export function buildVentanasAbrirDescription(config: VentanasAbrirConfig) {
  return `
    ${getModeloLabel(config.modelo)}
    ${config.linea}
    ${config.ancho}x${config.alto}
    ${config.color}
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
