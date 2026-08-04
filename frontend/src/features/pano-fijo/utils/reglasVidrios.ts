import type { PanoFijoLinea } from "../types";

export function obtenerVidriosPermitidos({
  ancho,
  alto,
  linea,
}: {
  ancho: number;
  alto: number;
  linea: PanoFijoLinea;
}) {
  const esModena = linea === "modena";

  // Hasta 100x100
  if (ancho <= 100 && alto <= 100) {
    return esModena
      ? ["3mm", "4mm", "5mm", "3+3", "4+4", "DVH 4+9+4", "DVH 5+9+5"]
      : ["3mm", "4mm", "5mm", "3+3", "4+4"];
  }

  // Hasta 200x200
  if (ancho <= 200 && alto <= 200) {
    return esModena
      ? ["4mm", "5mm", "3+3", "4+4", "DVH 4+9+4", "DVH 5+9+5"]
      : ["4mm", "5mm", "3+3", "4+4"];
  }

  // Hasta 210x200
  if (ancho <= 210 && alto <= 200) {
    return esModena
      ? ["5mm", "3+3", "4+4", "DVH 4+9+4", "DVH 5+9+5"]
      : ["5mm", "3+3", "4+4"];
  }

  // Más grandes
  return esModena ? ["3+3", "4+4", "DVH 4+9+4", "DVH 5+9+5"] : ["3+3", "4+4"];
}
