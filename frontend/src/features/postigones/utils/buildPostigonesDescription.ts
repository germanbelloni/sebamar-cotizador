import type { PostigonesConfig } from "../types";

function getCierreLabel(value: PostigonesConfig["hojaCierre"]) {
  switch (value) {
    case "izquierda":
      return "izquierda";

    case "derecha":
      return "derecha";

    case "centro-izquierda":
      return "centro izquierda";

    case "centro-derecha":
      return "centro derecha";

    default:
      return value;
  }
}

export function buildPostigonesDescription(config: PostigonesConfig) {
  const parts: string[] = [];

  // =========================
  // CORREDIZO
  // =========================

  if (config.tipo === "corredizo") {
    parts.push("Postigo corredizo");
    parts.push(`${config.ancho}x${config.alto}`);
    parts.push("aluminio");
    parts.push(config.color);

    if (config.microperforado) {
      parts.push("tablillas microperforadas");
    }

    if (config.herrajeBlanco) {
      parts.push("herrajes blancos");
    }

    return parts.join(" ");
  }

  // =========================
  // DE ABRIR
  // =========================

  parts.push("Postigo");
  parts.push(`${config.ancho}x${config.alto}`);
  parts.push("aluminio");
  parts.push(config.color);

  parts.push(`${config.cantidadHojas} hojas`);
  parts.push("de abrir");

  parts.push(`cierre ${getCierreLabel(config.hojaCierre)}`);

  if (config.marco) {
    parts.push(`marco ${config.marco}`);
  }

  if (config.microperforado) {
    parts.push("tablillas microperforadas");
  }

  if (config.herrajeBlanco) {
    parts.push("herrajes blancos");
  }

  return parts.join(" ");
}
