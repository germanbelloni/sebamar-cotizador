import type { VidrioType } from "@/shared/types/vidrios";

export type VentanasAbrirLinea = "Herrero" | "Modena";

export type VentanasAbrirBisagra = "izquierda" | "derecha";

export type VentanasAbrirColor =
  | "blanco"
  | "negro"
  | "bronce colonial"
  | "simil madera";

export type VentanasAbrirConfig = {
  ancho: number;

  alto: number;

  linea: VentanasAbrirLinea;

  color: VentanasAbrirColor;

  tipoVidrio?: VidrioType;

  mosquitero: boolean;

  bisagra?: VentanasAbrirBisagra;

  premarco: boolean;

  contramarco: boolean;

  herrajesBlancos: boolean;
};

export type VentanasAbrirItem = {
  tipo: "ventanas_abrir";

  cantidad: number;

  linea: VentanasAbrirLinea;

  medidas: {
    ancho: number;

    alto: number;
  };

  description: string;

  color: VentanasAbrirColor;

  configuracion: {
    tipoVidrio?: VidrioType;

    mosquitero: boolean;

    bisagra?: VentanasAbrirBisagra;

    premarco: boolean;

    contramarco: boolean;

    herrajesBlancos: boolean;
  };

  subtotal: number;
};
