export type RajaLinea = "Herrero" | "Modena";

export type RajaModelo = "raja" | "brazo" | "volcable" | "oscilobatiente";
import type { VidrioType } from "@/shared/types/vidrios";
export type RajaBisagra = "izquierda" | "derecha";

export type RajasConfig = {
  ancho: number;

  alto: number;

  linea: RajaLinea;

  color: "blanco" | "negro" | "bronce colonial" | "simil madera";

  tipoVidrio?: VidrioType;

  mosquitero: boolean;

  modelo: RajaModelo;

  desague?: string;

  bisagra?: RajaBisagra;

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

  color: string;

  configuracion: {
    tipoVidrio?: VidrioType;

    mosquitero: boolean;

    modelo: RajaModelo;

    desague?: string;

    bisagra?: RajaBisagra;

    premarco: boolean;

    contramarco: boolean;

    herrajesBlancos: boolean;
  };

  subtotal: number;
};
