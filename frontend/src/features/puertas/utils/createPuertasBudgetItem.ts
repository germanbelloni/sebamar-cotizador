import type { PuertasConfig } from "../types";

import type { BudgetItem } from "@/shared/budget/types/budget.types";

import { createBudgetItem } from "@/shared/budget/utils/createBudgetItem";

type CotizacionResponse = {
  precioVenta?: number;
  precioFinal?: number;
  subtotal?: number;
};

export function createPuertasBudgetItem(
  config: PuertasConfig,
  result: CotizacionResponse,
): BudgetItem {
  return createBudgetItem({
    modulo: "puertas",

    titulo: buildTitle(config),

    descripcion: buildDescription(config),

    configuracion: {
      ...config,
    },

    metadata: {
      linea: config.linea,
      color: config.color,
      vidrio: config.vidrio,
    },

    result,
  });
}

/* ========================= */
/* TITLE */
/* ========================= */

function buildTitle(config: PuertasConfig) {
  switch (config.tipoConfiguracion) {
    case "simple":
      return "Puerta simple";

    case "doble":
      return "Puerta doble";

    case "puerta_y_media":
      return "Puerta y media";

    case "porton":
      return "Portón";

    default:
      return "Puerta";
  }
}

/* ========================= */
/* DESCRIPTION */
/* ========================= */

function buildDescription(config: PuertasConfig) {
  const parts: string[] = [];

  parts.push(capitalize(config.linea));

  switch (config.tipoConfiguracion) {
    case "simple":
      parts.push("Puerta");
      break;

    case "doble":
      parts.push("Puerta doble");
      break;

    case "puerta_y_media":
      parts.push("Puerta y media");
      break;

    case "porton":
      parts.push("Portón");
      parts.push(`(${capitalize(config.tipoPorton)})`);
      break;
  }

  parts.push(formatModelo(config.modelo));

  if (
    config.tipoConfiguracion === "puerta_y_media" &&
    config.modeloMediaPuerta
  ) {
    parts.push(`Media: ${formatModelo(config.modeloMediaPuerta)}`);
  }

  const modeloSinVidrio =
    config.modelo === "modelo_5" ||
    config.modelo === "modelo_panel" ||
    config.modelo === "modelo_c_panel";

  if (!modeloSinVidrio && config.vidrio) {
    parts.push(`Vidrio ${formatVidrio(config.vidrio)}`);
  }

  parts.push(`Mano ${capitalize(config.mano)}`);

  parts.push(capitalize(config.color));

  parts.push(`${config.ancho}x${config.alto}`);

  return parts.join(" • ");
}

/* ========================= */
/* HELPERS */
/* ========================= */

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatModelo(modelo: string) {
  return modelo.replaceAll("_", " ");
}

function formatVidrio(vidrio: string) {
  if (vidrio === "dvh_4_9_4") {
    return "DVH 4+9+4";
  }

  if (vidrio === "dvh_5_9_5") {
    return "DVH 5+9+5";
  }

  return vidrio;
}
