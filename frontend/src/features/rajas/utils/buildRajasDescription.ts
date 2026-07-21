import type { RajasConfig } from "../types";

function getProductoLabel(modelo: RajasConfig["modelo"]) {
  switch (modelo) {
    case "brazo":
      return "Brazo de empuje";

    case "volcable":
      return "Volcable";

    case "oscilobatiente":
      return "Oscilobatiente";

    default:
      return "Raja";
  }
}

export function buildRajasDescription(config: RajasConfig) {
  const descripcionVidrio =
    !config.tipoVidrio || config.tipoVidrio === "3mm"
      ? ""
      : `vidrio ${config.tipoVidrio}`;

  return `
    ${getProductoLabel(config.modelo)}
    ${config.ancho}x${config.alto}
    aluminio
    ${config.color}
    ${config.bisagra ? `bisagra ${config.bisagra}` : ""}
    ${config.linea}
    ${descripcionVidrio}
    ${config.mosquitero ? "mosquitero fijo" : ""}
    ${config.premarco ? "c/premarco" : ""}
    ${config.contramarco ? "c/contramarco" : ""}
    ${config.herrajesBlancos ? "herrajes blancos" : ""}
  `
    .replace(/\s+/g, " ")
    .trim();
}
