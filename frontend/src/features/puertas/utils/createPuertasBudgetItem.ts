import type { PuertasConfig, PuertasItem } from "../types";

export function createPuertasBudgetItem(
  config: PuertasConfig,
  result: {
    precioVenta?: number;

    precioFinal?: number;
  },
): PuertasItem {
  const subtotal =
    Number(result?.precioFinal) || Number(result?.precioVenta) || 0;

  return {
    tipo: "puertas",

    cantidad: 1,

    linea: config.linea,

    medidas: {
      ancho: config.ancho,
      alto: config.alto,
    },

    description: buildDescription(config),

    color: config.color,

    configuracion: {
      tipoConfiguracion: config.tipoConfiguracion,

      tipoPorton: config.tipoPorton,

      modelo: config.modelo,

      modeloMediaPuerta: config.modeloMediaPuerta,

      mano: config.mano,

      hojas: config.hojas,

      anchoPrincipal: config.anchoPrincipal,

      vidrio: config.vidrio,

      extras: config.extras,
    },

    subtotal,
  };
}

/* ========================= */
/* DESCRIPTION */
/* ========================= */

function buildDescription(config: PuertasConfig) {
  const parts: string[] = [];

  /* LINEA */

  parts.push(capitalize(config.linea));

  /* TIPO */

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
      break;
  }

  /* MODELO */

  parts.push(config.modelo.replaceAll("_", " ").toUpperCase());

  /* PORTON */

  if (config.tipoConfiguracion === "porton") {
    parts.push(`(${config.tipoPorton})`);
  }

  /* VIDRIO */

  const modeloSinVidrio =
    config.modelo === "modelo_5" || config.modelo === "modelo_panel";

  if (!modeloSinVidrio && config.vidrio) {
    parts.push(`Vidrio ${config.vidrio}`);
  }

  /* COLOR */

  parts.push(capitalize(config.color));

  /* MEDIDAS */

  parts.push(`${config.ancho}x${config.alto}`);

  return parts.join(" • ");
}

/* ========================= */
/* HELPERS */
/* ========================= */

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
