import { apiFetch } from "@/lib/api";

import type { PuertasConfig } from "../types";

import { BACKEND_MODEL_MAPPINGS } from "../models/backendMappings";

type CotizacionPuertasResponse = {
  precioVenta?: number;

  precioFinal?: number;
};

function normalizeModelo(modelo?: string) {
  if (!modelo) {
    return "";
  }

  return modelo.replaceAll("_", " ").trim();
}

export async function cotizarPuertas(
  config: PuertasConfig,
): Promise<CotizacionPuertasResponse> {
  const backendMappings =
    BACKEND_MODEL_MAPPINGS[config.linea as keyof typeof BACKEND_MODEL_MAPPINGS];

  const backendModelo =
    backendMappings?.[config.modelo as keyof typeof backendMappings] ||
    normalizeModelo(config.modelo);

  const backendModeloMedia =
    backendMappings?.[
      config.modeloMediaPuerta as keyof typeof backendMappings
    ] || normalizeModelo(config.modeloMediaPuerta);

  const modeloSinVidrio =
    config.modelo === "modelo_5" || config.modelo === "modelo_panel";

  const body = {
    ancho: config.ancho,

    alto: config.alto,

    linea: config.linea,

    tipo:
      config.tipoConfiguracion === "porton"
        ? config.tipoPorton
        : config.tipoConfiguracion,

    modelo: backendModelo,

    modeloPuerta: backendModelo,

    modeloMedia: backendModeloMedia,

    color: config.color,

    apertura: config.mano,

    mano: config.mano,

    hojas: config.hojas || 1,

    anchoPrincipal: config.anchoPrincipal,

    tipoVidrio: modeloSinVidrio ? undefined : config.vidrio,

    extras: config.extras,
  };

  /* PORTON */

  if (config.tipoConfiguracion === "porton") {
    return apiFetch<CotizacionPuertasResponse>("/api/portones", {
      method: "POST",

      body: JSON.stringify(body),
    });
  }

  /* ECO */

  if (config.linea === "eco") {
    return apiFetch<CotizacionPuertasResponse>("/api/puertas/eco", {
      method: "POST",

      body: JSON.stringify(body),
    });
  }

  /* STANDARD */

  return apiFetch<CotizacionPuertasResponse>("/api/puertas", {
    method: "POST",

    body: JSON.stringify(body),
  });
}
