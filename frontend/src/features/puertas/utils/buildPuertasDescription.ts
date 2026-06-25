import type { PuertasConfig } from "../types";

export function buildPuertasDescription(config: PuertasConfig) {
  const parts: string[] = [];

  /* LINEA */

  parts.push(capitalize(config.linea));

  /* TIPO */

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
      parts.push("Portón");
      break;
  }

  /* PORTON */

  if (config.tipoConfiguracion === "porton") {
    parts.push(capitalize(config.tipoPorton));
  }

  /* MODELO */

  parts.push(config.modelo.replaceAll("_", " ").toUpperCase());

  /* MEDIA PUERTA */

  if (
    config.tipoConfiguracion === "puerta_y_media" &&
    config.modeloMediaPuerta
  ) {
    parts.push(`Media: ${config.modeloMediaPuerta.replaceAll("_", " ")}`);
  }

  /* VIDRIO */

  if (config.vidrio) {
    parts.push(`Vidrio ${config.vidrio}`);
  }

  /* EXTRAS */

  if (config.extras.barralRecto) {
    parts.push("Barral recto");
  }

  if (config.extras.barralCurvo) {
    parts.push("Barral curvo");
  }

  if (config.extras.mediaManija) {
    parts.push("Media manija");
  }

  if (config.extras.picaporte) {
    parts.push("Picaporte");
  }

  /* COLOR */

  parts.push(capitalize(config.color));

  /* MEDIDAS */

  parts.push(`${config.ancho}x${config.alto}`);

  return parts.join(" • ");
}

/* ========================= */
/* HELPERS */
/* ========================= */

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
