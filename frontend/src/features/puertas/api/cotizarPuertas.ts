import api from "@/lib/api";

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
  const backendMappings = BACKEND_MODEL_MAPPINGS[config.linea];

  const backendModelo =
    backendMappings?.[config.modelo as keyof typeof backendMappings] ||
    normalizeModelo(config.modelo);

  const backendModeloMedia = config.modeloMediaPuerta
    ? backendMappings?.[
        config.modeloMediaPuerta as keyof typeof backendMappings
      ] || normalizeModelo(config.modeloMediaPuerta)
    : undefined;

  const modeloSinVidrio =
    config.modelo === "modelo_5" || config.modelo === "modelo_panel";

  const body = {
    ancho: config.ancho,
    alto: config.alto,

    linea: config.linea,

    configuracion: config.tipoConfiguracion,
    tipoPorton: config.tipoPorton,

    modelo: backendModelo,
    modeloMedia: backendModeloMedia,

    color: config.color,
    mano: config.mano,

    hojas: config.hojas,
    anchoPrincipal: config.anchoPrincipal,

    tipoVidrio: modeloSinVidrio ? undefined : config.vidrio,

    premarco: config.premarco,
    contramarco: config.contramarco,

    extras: config.extras,
  };

  if (config.tipoConfiguracion === "porton") {
    const { data } = await api.post<CotizacionPuertasResponse>(
      "/portones",
      body,
    );

    return data;
  }

  if (config.linea === "eco") {
    const { data } = await api.post<CotizacionPuertasResponse>(
      "/puertas/eco",
      body,
    );

    return data;
  }

  const { data } = await api.post<CotizacionPuertasResponse>("/puertas", body);

  return data;
}
