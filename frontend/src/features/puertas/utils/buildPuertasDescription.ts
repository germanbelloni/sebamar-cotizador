import type { PuertasConfig } from "../types";

export function buildPuertasDescription(config: PuertasConfig) {
  return `
    Puerta
    ${config.linea}
    ${config.modelo}
    ${config.ancho}x${config.alto}
    ${config.color}
    ${config.tipo}
    ${config.hojas} hojas
    apertura ${config.apertura}
    ${config.vidrio ? `vidrio ${config.vidrio}` : ""}
    ${config.extras.manija ? "c/manija" : ""}
    ${config.extras.picaporte ? "c/picaporte" : ""}
    ${config.extras.barralRecto ? "barral recto" : ""}
    ${config.extras.barralCurvo ? "barral curvo" : ""}
  `
    .replace(/\s+/g, " ")
    .trim();
}
