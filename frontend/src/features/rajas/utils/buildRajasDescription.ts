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
function getTipoVidrioLabel(tipoVidrio?: string) {
  switch (tipoVidrio) {
    case "DVH":
    case "dvh":
    case "DVH 4+9+4":
      return "DVH 4+9+4";

    default:
      return tipoVidrio;
  }
}
export function buildRajasDescription(config: RajasConfig) {
  const vidrio = getTipoVidrioLabel(config.tipoVidrio);

  const descripcionVidrio =
    !vidrio || vidrio === "3mm" ? "" : `vidrio ${vidrio}`;

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
