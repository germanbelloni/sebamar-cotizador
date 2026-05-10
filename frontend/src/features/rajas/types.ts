export type RajaLinea = "Herrero" | "Modena";

export type RajaModelo = "raja" | "brazo" | "volcable" | "oscilobatiente";
import type { VidrioType } from "@/shared/types/vidrios";
export type RajaBisagra = "izquierda" | "derecha";

export type RajaVidrio =
  | "3mm"
  | "4mm"
  | "5mm"
  | "esmerilado"
  | "fantasia"
  | "3+3";

export type RajasConfig = {
  ancho: number;

  alto: number;

  linea: RajaLinea;

  color: "blanco" | "negro" | "bronce colonial" | "simil madera";

  vidrio?: string;

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
    vidrio?: string;

    tipoVidrio?: RajaVidrio;

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
