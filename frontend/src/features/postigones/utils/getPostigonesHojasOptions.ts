import type { CantidadHojasPostigon, TipoPostigon } from "../types";

type Params = {
  tipo: TipoPostigon;

  ancho: number;
};

export function getPostigonesHojasOptions({
  tipo,
  ancho,
}: Params): CantidadHojasPostigon[] {
  // CORREDIZO
  if (tipo === "corredizo") {
    return [2];
  }

  // HASTA 120
  if (ancho <= 120) {
    return [2];
  }

  // 121 → 149
  if (ancho >= 121 && ancho <= 149) {
    return [2, 3];
  }

  // 150 → 200
  if (ancho >= 150 && ancho <= 200) {
    return [3];
  }

  // +200
  return [3, 4];
}
