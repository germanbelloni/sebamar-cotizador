import type { PatagonicasConfig } from "../types";

function getRajaLabel(tipo: PatagonicasConfig["tipoRaja"]) {
  switch (tipo) {
    case "brazo":
      return "Brazo de empuje";

    case "volcable":
      return "Volcable";

    case "oscilobatiente":
      return "Oscilobatiente";

    default:
      return "Raja bis";
  }
}

export function buildPatagonicasDescription(config: PatagonicasConfig) {
  const parts: string[] = [];

  parts.push("Patagonica");
  parts.push(`${config.ancho}x${config.alto}`);
  parts.push("aluminio");
  parts.push(config.color);
  parts.push(config.linea);
  parts.push(`vidrio ${config.tipoVidrio}`);

  const rajaLabel = getRajaLabel(config.tipoRaja);

  let composicion = "";

  // =========================
  // UNA RAJA
  // =========================

  if (config.tipo === "1_raja") {
    const anchoRaja = Number(config.anchoRaja);
    const anchoPano = config.ancho - anchoRaja;

    if (config.ladoApertura === "izquierda") {
      composicion = `(
${rajaLabel} izquierda ${anchoRaja} + Paño fijo ${anchoPano}
)`;
    } else {
      composicion = `(
Paño fijo ${anchoPano} + ${rajaLabel} derecha ${anchoRaja}
)`;
    }
  }

  // =========================
  // DOS RAJAS
  // =========================

  if (config.tipo === "2_rajas") {
    const anchoRaja = Number(config.anchoRaja);
    const anchoPano = config.ancho - anchoRaja * 2;

    composicion = `(
${rajaLabel} izquierda ${anchoRaja} + Paño fijo ${anchoPano} + ${rajaLabel} derecha ${anchoRaja}
)`;
  }

  if (composicion) {
    parts.push(
      composicion.replace(/\s+/g, " ").replace("( ", "(").replace(" )", ")"),
    );
  }

  // =========================
  // EXTRAS
  // =========================

  if (config.mosquitero) {
    parts.push("c/mosquitero fijo");
  }

  if (config.guia) {
    parts.push("c/guia");
  }

  if (config.cajonBlock) {
    parts.push("c/cajon block");
  }

  if (config.cortina === "pvc") {
    parts.push("PVC");
  }

  if (config.cortina === "aluminio") {
    parts.push("cortina aluminio");
  }

  if (config.premarco) {
    parts.push("c/premarco");
  }

  if (config.contramarco) {
    parts.push("c/contramarco");
  }

  if (config.herrajesBlancos) {
    parts.push("herrajes blancos");
  }

  return parts.join(" ");
}
