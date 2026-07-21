import type { VentanasAbrirConfig } from "../types";

export function buildVentanasAbrirDescription(config: VentanasAbrirConfig) {
  const descripcionVidrio =
    !config.tipoVidrio || config.tipoVidrio === "3mm"
      ? ""
      : `vidrio ${config.tipoVidrio}`;
  return `
    Ventana de abrir
    ${config.ancho}x${config.alto}
    aluminio
    ${config.color}
    ${config.linea}
    ${descripcionVidrio}
    ${config.bisagra ? `bisagra ${config.bisagra}` : ""}
    ${config.mosquitero ? "c/mosquitero" : ""}
    ${config.premarco ? "c/premarco" : ""}
    ${config.contramarco ? "c/contramarco" : ""}
    ${config.herrajesBlancos ? "herrajes blancos" : ""}
  `
    .replace(/\s+/g, " ")
    .trim();
}
