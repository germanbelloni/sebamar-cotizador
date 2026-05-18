import type { PatagonicasConfig } from "../types";

export function buildPatagonicasDescription(config: PatagonicasConfig) {
  const tipoLabel = config.tipo === "1_raja" ? "1 Raja" : "2 Rajas";

  const ubicacionRaja =
    config.tipo === "1_raja"
      ? config.ladoApertura === "izquierda"
        ? "Raja a la izquierda"
        : "Raja a la derecha"
      : null;

  const anchoRajaLabel =
    typeof config.anchoRaja === "number" ? `Raja ${config.anchoRaja}cm` : null;

  return [
    "Patagónica",

    config.linea,

    tipoLabel,

    `${config.ancho}x${config.alto}`,

    config.color,

    `vidrio ${config.tipoVidrio}`,

    anchoRajaLabel,

    ubicacionRaja,

    config.fueraDeMedida ? "Fuera de medida" : null,

    config.mosquitero ? "Mosquitero" : null,

    config.premarco ? "Premarco" : null,

    config.contramarco ? "Contramarco" : null,

    config.guia ? "Guía" : null,

    config.cajonBlock ? "Cajón Block" : null,

    config.cortina === "pvc"
      ? "Cortina PVC"
      : config.cortina === "aluminio"
        ? "Cortina Aluminio"
        : null,
  ]
    .filter(Boolean)
    .join(" · ");
}
