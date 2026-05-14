export type PatagonicasLinea = "Herrero" | "Modena";

export type PatagonicasTipo = "1_raja" | "2_rajas";

export type PatagonicasColor =
  | "blanco"
  | "negro"
  | "bronce colonial"
  | "simil madera";

export type PatagonicasTipoVidrio =
  | "4mm"
  | "3+3"
  | "4+4"
  | "DVH 4+9+4"
  | "DVH 5+9+5";

export type LadoApertura = "izquierda" | "derecha";

export type MedidaRaja = 40 | 50 | 60;

export interface PatagonicasConfig {
  linea: PatagonicasLinea;

  tipo: PatagonicasTipo;

  ancho: number;

  alto: number;

  color: PatagonicasColor;

  tipoVidrio: PatagonicasTipoVidrio;

  cantidadRajas: 1 | 2;

  anchoRaja: MedidaRaja;

  ladoApertura: LadoApertura;

  bisagraRaja1: LadoApertura;

  bisagraRaja2: LadoApertura;

  tipoApertura: "abrir";

  mosquitero: boolean;

  premarco: boolean;

  contramarco: boolean;

  guia: boolean;

  cajonBlock: boolean;

  cortinaPVC: boolean;

  cortinaAluminio: boolean;
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

    anchoRaja: MedidaRaja;

    tipoVidrio: PatagonicasTipoVidrio;

    ladoApertura: LadoApertura;

    bisagraRaja1: LadoApertura;

    bisagraRaja2: LadoApertura;

    tipoApertura: "abrir";
  };

  subtotal: number;
}
