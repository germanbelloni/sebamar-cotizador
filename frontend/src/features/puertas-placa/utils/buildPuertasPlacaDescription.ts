import type { PuertasPlacaConfig } from "../types";

function getModeloLabel(modelo: PuertasPlacaConfig["modelo"]) {
  switch (modelo) {
    case "finger_pino":
    case "finger_cedro":
      return "finger";

    case "cedro_cedro":
      return "cedro";

    case "granero_z":
      return "Z";

    case "granero_finger":
      return "Finger";

    case "granero_aluminio":
      return "Aluminio";

    case "granero_aluminio_sin_herrajes":
      return "Aluminio sin herrajes";

    default:
      return "";
  }
}

export function buildPuertasPlacaDescription(config: PuertasPlacaConfig) {
  //
  // GRANERO
  //
  if (config.tipo === "granero") {
    return `Puerta granero ${config.ancho}x${config.alto} estilo ${getModeloLabel(config.modelo)}`
      .replace(/\s+/g, " ")
      .trim();
  }

  //
  // MARCO ALUMINIO
  //
  if (config.marco === "aluminio") {
    return `
      Puerta placa
      ${config.ancho}x${config.alto}
      marco aluminio
      ${config.mano}
      ${config.fueraDeMedida ? "fuera de medida" : ""}
    `
      .replace(/\s+/g, " ")
      .trim();
  }

  const espesor = config.marco === "marco_10" ? "10" : "15";
  const modelo = getModeloLabel(config.modelo);

  //
  // EMBUTIR
  //
  if (config.tipo === "embutir") {
    return `
      Puerta embutir
      ${config.ancho}x${config.alto}x${espesor}
      marco ${modelo}
      ${config.fueraDeMedida ? "fuera de medida" : ""}
    `
      .replace(/\s+/g, " ")
      .trim();
  }

  //
  // TRADICIONAL
  //
  return `
    Puerta placa
    ${config.ancho}x${config.alto}x${espesor}
    marco ${modelo}
    ${config.mano}
    ${config.fueraDeMedida ? "fuera de medida" : ""}
  `
    .replace(/\s+/g, " ")
    .trim();
}
