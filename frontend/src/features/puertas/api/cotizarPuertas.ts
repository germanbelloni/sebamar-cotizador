import { apiFetch } from "@/lib/api";

import type { PuertasConfig } from "../types";

type CotizacionPuertasResponse = {
  precioVenta?: number;
};

export async function cotizarPuertas(
  config: PuertasConfig,
): Promise<CotizacionPuertasResponse> {
  const body = {
    ancho: config.ancho,

    alto: config.alto,

    linea: config.linea,

    tipo:
      config.tipoConfiguracion === "porton"
        ? config.tipoPorton
        : config.tipoConfiguracion,

    modelo: config.modelo,

    modeloMediaPuerta: config.modeloMediaPuerta,

    color: config.color,

    apertura: config.mano,

    mano: config.mano,

    hojas: config.hojas,

    anchoPrincipal: config.anchoPrincipal,

    vidrio: config.vidrio,

    extras: config.extras,
  };

  /* PORTON */

  if (config.tipoConfiguracion === "porton") {
    return apiFetch<CotizacionPuertasResponse>("/portones", {
      method: "POST",

      body: JSON.stringify(body),
    });
  }

  /* PUERTAS */

  if (config.linea === "eco") {
    return apiFetch<CotizacionPuertasResponse>("/puertas/eco", {
      method: "POST",

      body: JSON.stringify(body),
    });
  }

  return apiFetch<CotizacionPuertasResponse>("/puertas", {
    method: "POST",

    body: JSON.stringify(body),
  });
}
