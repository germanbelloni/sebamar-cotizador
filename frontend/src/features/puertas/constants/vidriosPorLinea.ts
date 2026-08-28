import type { PuertaLinea, PuertaVidrioMedia } from "../types";

export const VIDRIOS_POR_LINEA: Record<PuertaLinea, string[]> = {
  herrero: ["3mm", "4mm", "5mm", "fantasia", "esmerilado", "3+3"],

  modena: ["3mm", "4mm", "5mm", "fantasia", "esmerilado", "3+3", "dvh_4_9_4"],

  eco: ["3mm", "4mm", "fantasia"],
};

export const VIDRIOS_MEDIA_POR_LINEA: Record<PuertaLinea, PuertaVidrioMedia[]> =
  {
    herrero: ["4mm", "3+3", "fantasia", "esmerilado"],

    modena: ["4mm", "3+3", "fantasia", "esmerilado"],

    eco: ["4mm", "fantasia"],
  };
