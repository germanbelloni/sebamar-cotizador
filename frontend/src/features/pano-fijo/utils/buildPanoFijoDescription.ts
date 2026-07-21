import type { PanoFijoConfig } from "../types";

export function buildPanoFijoDescription(config: PanoFijoConfig) {
  const descripcionVidrio =
    !config.tipoVidrio || config.tipoVidrio === "3mm"
      ? ""
      : `vidrio ${config.tipoVidrio}`;
  return `
Paño fijo
${config.ancho}x${config.alto}
aluminio
${config.color}
${config.linea}
${descripcionVidrio}
${config.premarco ? "c/premarco" : ""}
${config.contramarco ? "c/contramarco" : ""}
`
    .replace(/\s+/g, " ")
    .trim();
}
