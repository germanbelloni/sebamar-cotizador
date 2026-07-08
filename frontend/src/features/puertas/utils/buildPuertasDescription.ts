import type { PuertasConfig } from "../types";

export function buildPuertasDescription(config: PuertasConfig) {
  const parts: string[] = [];

  // =========================
  // PRODUCTO
  // =========================

  switch (config.tipoConfiguracion) {
    case "simple":
      parts.push("Puerta");
      break;

    case "doble":
      parts.push("Puerta doble");
      break;

    case "puerta_y_media":
      parts.push("Puerta y media");
      break;

    case "porton":
      parts.push("Porton");
      break;
  }

  // =========================
  // MEDIDAS
  // =========================

  parts.push(`${config.ancho}x${config.alto}`);

  // =========================
  // MATERIAL
  // =========================

  parts.push("aluminio");

  // =========================
  // COLOR
  // =========================

  parts.push(config.color);

  // =========================
  // LINEA
  // =========================

  parts.push(capitalize(config.linea));

  // =========================
  // PORTON
  // =========================

  if (config.tipoConfiguracion === "porton") {
    parts.push(`${config.hojas} hojas`);
    parts.push(`de ${config.tipoPorton}`);

    const principal = getPortonPrincipalLabel(config);

    if (principal) {
      parts.push(principal);
    }
  }

  // =========================
  // MANO
  // =========================

  if (config.tipoConfiguracion === "simple") {
    parts.push(config.mano);
  }

  if (
    config.tipoConfiguracion === "puerta_y_media" ||
    config.tipoConfiguracion === "doble"
  ) {
    parts.push(`principal ${config.mano}`);
  }

  // =========================
  // MODELO
  // =========================

  if (config.modelo) {
    const modelo = config.modelo
      .replace("modelo_", "modelo ")
      .replaceAll("_", " ");

    parts.push(modelo);
  }

  // =========================
  // MEDIA PUERTA
  // =========================

  if (
    config.tipoConfiguracion === "puerta_y_media" &&
    config.modeloMediaPuerta
  ) {
    parts.push(`media ${config.modeloMediaPuerta.replaceAll("_", " ")}`);
  }

  // =========================
  // VIDRIO
  // =========================
  const llevaVidrio =
    config.modelo !== "modelo_5" &&
    config.modelo !== "modelo_panel" &&
    config.modelo !== "modelo_c_panel";
  if (llevaVidrio && config.vidrio) {
    parts.push(`vidrio ${formatVidrio(config.vidrio)}`);
  }
  // =========================
  // EXTRAS
  // =========================

  if (config.extras.barralRecto) {
    parts.push("barral recto");
  }

  if (config.extras.barralCurvo) {
    parts.push("barral curvo");
  }

  if (config.extras.mediaManija) {
    parts.push("media manija");
  }

  if (config.extras.picaporte) {
    parts.push("picaporte");
  }

  return parts.join(" ");
}

/* ========================= */
/* HELPERS */
/* ========================= */

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatVidrio(vidrio: string) {
  switch (vidrio) {
    case "dvh_4_9_4":
      return "DVH 4+9+4";

    case "dvh_5_9_5":
      return "DVH 5+9+5";

    default:
      return vidrio;
  }
}

function getPortonPrincipalLabel(config: PuertasConfig) {
  const { hojas, hojaPrincipal, tipoPorton } = config;

  if (!hojaPrincipal) {
    return "";
  }

  // =========================
  // ABRIR
  // =========================

  if (tipoPorton === "abrir") {
    if (hojas === 3) {
      switch (hojaPrincipal) {
        case 1:
          return "puerta izquierda mano izquierda";

        case 2:
          return "puerta del medio izquierda";

        case 3:
          return "puerta del medio derecha";

        case 4:
          return "puerta derecha mano derecha";

        default:
          return "";
      }
    }

    if (hojas === 4) {
      switch (hojaPrincipal) {
        case 1:
          return "puerta izquierda mano izquierda";

        case 2:
          return "puerta centro izquierda";

        case 3:
          return "puerta centro derecha";

        case 4:
          return "puerta derecha mano derecha";

        default:
          return "";
      }
    }
  }

  // =========================
  // PLEGADIZO
  // =========================

  if (tipoPorton === "plegadizo") {
    switch (hojaPrincipal) {
      case 1:
        return "puerta izquierda mano izquierda pliega hacia la derecha";

      case 4:
        return "puerta derecha mano derecha pliega hacia la izquierda";

      default:
        return "";
    }
  }

  // =========================
  // CORREDIZO
  // =========================

  if (tipoPorton === "corredizo") {
    switch (hojaPrincipal) {
      case 1:
        return "puerta izquierda mano derecha corre hacia la izquierda";

      case 4:
        return "puerta derecha mano izquierda corre hacia la derecha";

      default:
        return "";
    }
  }

  return "";
}
