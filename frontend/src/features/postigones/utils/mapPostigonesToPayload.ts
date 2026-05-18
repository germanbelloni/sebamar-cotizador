import type { PostigonesConfig, PostigonesPayload } from "../types";

export function mapPostigonesToPayload(
  config: PostigonesConfig,
): PostigonesPayload {
  return {
    ancho: config.ancho,

    alto: config.alto,

    tipo: config.tipo,

    hojas: config.cantidadHojas,

    apertura: config.hojaCierre,

    color: config.color,

    extras: {
      microperforado: config.microperforado,

      herrajeBlanco: config.herrajeBlanco,
    },

    marco: config.marco,
  };
}
