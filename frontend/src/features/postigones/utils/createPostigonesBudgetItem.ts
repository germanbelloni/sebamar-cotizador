import type { PostigonesConfig, PostigonesItem } from "../types";

import { buildPostigonesDescription } from "./buildPostigonesDescription";

export function createPostigonesBudgetItem(
  config: PostigonesConfig,
): PostigonesItem {
  return {
    tipo: "postigones",

    cantidad: 1,

    tipoPostigon: config.tipo,

    medidas: {
      ancho: config.ancho,
      alto: config.alto,
    },

    description: buildPostigonesDescription(config),

    color: config.color,

    extras: {
      cantidadHojas: config.cantidadHojas,
      hojaCierre: config.hojaCierre,
      microperforado: config.microperforado,
      herrajeBlanco: config.herrajeBlanco,
    },

    subtotal: 0,
  };
}
