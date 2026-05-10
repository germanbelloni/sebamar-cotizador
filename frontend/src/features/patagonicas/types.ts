export type PatagonicaLinea = "Herrero" | "Modena";

export type PatagonicaTipo = "1_raja" | "2_rajas";

export type PatagonicaVidrio = "4mm" | "3+3";

export type PatagonicasConfig = {
  ancho: number;

  alto: number;

  linea: PatagonicaLinea;

  tipo: PatagonicaTipo;

  color: "blanco" | "negro" | "bronce colonial" | "simil madera";

  cantidadRajas: number;

  tipoVidrio: PatagonicaVidrio;

  ladoApertura: "izquierda" | "derecha";

  tipoApertura: "abrir" | "corredizo";

  premarco: boolean;

  contramarco: boolean;

  mosquitero: boolean;

  raja?: {
    ancho: number;

    tipoVidrio?: PatagonicaVidrio;
  };
};

export type PatagonicasItem = {
  tipo: "patagonicas";

  cantidad: number;

  linea: PatagonicaLinea;

  medidas: {
    ancho: number;

    alto: number;
  };

  description: string;

  color: string;

  configuracion: {
    tipo: PatagonicaTipo;

    cantidadRajas: number;

    tipoVidrio: PatagonicaVidrio;

    ladoApertura: "izquierda" | "derecha";

    tipoApertura: "abrir" | "corredizo";
    premarco: boolean;

    contramarco: boolean;

    mosquitero: boolean;
  };

  subtotal: number;
};
