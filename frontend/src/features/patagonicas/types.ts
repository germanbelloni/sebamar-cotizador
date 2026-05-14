export type PatagonicasLinea = "Herrero" | "Modena";

export type PatagonicasTipo = "1_raja" | "2_rajas";

export type PatagonicasColor =
  | "blanco"
  | "negro"
  | "bronce colonial"
  | "simil madera";

export type PatagonicasTipoVidrio = "4mm" | "3+3" | "4+4" | "DVH" | "DVH 5+9+5";

export type LadoApertura = "izquierda" | "derecha";

export interface PatagonicasConfig {
  linea: PatagonicasLinea;

  tipo: PatagonicasTipo;

  ancho: number;

  alto: number;

  color: PatagonicasColor;

  tipoVidrio: PatagonicasTipoVidrio;

  cantidadRajas: 1 | 2;

  anchoRaja: number;

  ladoApertura: "izquierda" | "derecha";

  tipoApertura: "abrir";

  mosquitero: boolean;

  premarco: boolean;

  contramarco: boolean;
}

export interface PatagonicasItem {
  tipo: "patagonicas";

  cantidad: number;

  linea: PatagonicasLinea;

  medidas: {
    ancho: number;
    alto: number;
  };

  description: string;

  color: PatagonicasColor;

  configuracion: {
    tipo: PatagonicasTipo;

    premarco: boolean;

    contramarco: boolean;

    mosquitero: boolean;

    cantidadRajas: 1 | 2;

    tipoVidrio: PatagonicasTipoVidrio;

    ladoApertura: LadoApertura;

    tipoApertura: "abrir";
  };

  subtotal: number;
}
