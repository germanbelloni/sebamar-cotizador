import type {
  PuertasPlacaMarco,
  PuertasPlacaModelo,
  PuertasPlacaTipo,
} from "../types";

export function getPuertaPlacaTipoLabel(tipo: PuertasPlacaTipo) {
  switch (tipo) {
    case "abrir":
      return "De abrir";

    case "embutir":
      return "De embutir";

    case "granero":
      return "Granero";

    default:
      return tipo;
  }
}

export function getPuertaPlacaMarcoLabel(marco: PuertasPlacaMarco) {
  switch (marco) {
    case "marco_10":
      return "Marco 10";

    case "marco_15":
      return "Marco 15";

    case "aluminio":
      return "Marco aluminio blanco";

    default:
      return marco;
  }
}

export function getPuertaPlacaModeloLabel(modelo: PuertasPlacaModelo) {
  switch (modelo) {
    case "finger_pino":
      return "Finger / Pino";

    case "finger_cedro":
      return "Finger / Cedro";

    case "cedro_pino":
      return "Cedro / Pino";

    case "cedro_cedro":
      return "Cedro / Cedro";

    case "aluminio_pino":
      return "Aluminio / Pino";

    case "aluminio_cedro":
      return "Aluminio / Cedro";

    default:
      return modelo;
  }
}
