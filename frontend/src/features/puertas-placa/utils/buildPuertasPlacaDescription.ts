import type { PuertasPlacaConfig } from "../types";

function getTipoLabel(tipo: PuertasPlacaConfig["tipo"]) {
  switch (tipo) {
    case "abrir":
      return "De abrir";

    case "embutir":
      return "De embutir";

    case "granero":
      return "Granero";

    default:
      return tipo;
  }
}

function getMarcoLabel(marco: PuertasPlacaConfig["marco"]) {
  switch (marco) {
    case "marco_10":
      return "Marco 10";

    case "marco_15":
      return "Marco 15";

    case "aluminio":
      return "Marco aluminio";

    default:
      return marco;
  }
}

function getModeloLabel(modelo: PuertasPlacaConfig["modelo"]) {
  switch (modelo) {
    case "finger_pino":
      return "Finger / Pino";

    case "finger_cedro":
      return "Finger / Cedro";

    case "cedro_cedro":
      return "Cedro / Cedro";

    case "aluminio_pino":
      return "Aluminio / Pino";

    case "aluminio_cedro":
      return "Aluminio / Cedro";

    case "granero_z":
      return "Z";

    case "granero_finger":
      return "Finger";

    case "granero_aluminio":
      return "Aluminio";

    case "granero_aluminio_sin_herrajes":
      return "Aluminio sin herrajes";

    default:
      return modelo;
  }
}

export function buildPuertasPlacaDescription(config: PuertasPlacaConfig) {
  const tipo = getTipoLabel(config.tipo);
  const marco = getMarcoLabel(config.marco);
  const modelo = getModeloLabel(config.modelo);

  const manoTexto = config.tipo !== "embutir" ? ` mano ${config.mano}` : "";

  return `
    Puerta placa
    ${tipo}
    ${modelo}
    ${config.ancho}x${config.alto}
    ${marco}
    ${manoTexto}
    ${config.fueraDeMedida ? "fuera de medida" : ""}
  `
    .replace(/\s+/g, " ")
    .trim();
}
