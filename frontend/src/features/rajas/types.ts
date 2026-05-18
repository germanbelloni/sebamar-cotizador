import type { VidrioType } from "@/shared/types/vidrios";

export type RajaLinea = "Herrero" | "Modena";

export type RajaModelo = "raja" | "brazo" | "volcable" | "oscilobatiente";

export type RajaBisagra = "izquierda" | "derecha";

export type PosicionOscilo = "cerrada" | "abrir" | "oscilo";

export type RajaDesague = "visible" | "oculto";

export type RajaColor = "blanco" | "negro" | "bronce colonial" | "simil madera";

export type RajasConfig = {
  ancho: number;

  alto: number;

  linea: RajaLinea;

  color: RajaColor;

  tipoVidrio?: VidrioType;

  mosquitero: boolean;

  modelo: RajaModelo;

  apertura?: string;

  desague?: RajaDesague;

  bisagra?: RajaBisagra;

  posicionOscilo?: PosicionOscilo;

  premarco: boolean;

  contramarco: boolean;

  herrajesBlancos: boolean;
};

export type RajasItem = {
  tipo: "rajas";

  cantidad: number;

  linea: RajaLinea;

  medidas: {
    ancho: number;

    alto: number;
  };

  description: string;

  color: RajaColor;

  configuracion: {
    tipoVidrio?: VidrioType;

    mosquitero: boolean;

    modelo: RajaModelo;

    desague?: RajaDesague;

    bisagra?: RajaBisagra;

    premarco: boolean;

    contramarco: boolean;

    herrajesBlancos: boolean;
  };

  subtotal: number;
};
