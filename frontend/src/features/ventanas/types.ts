import type { ColorVentana } from "./constants";

import type { LineaAluminio } from "@/shared/types/lineas";

import type { VidrioType } from "@/shared/types/vidrios";

export type VentanaItem = {
  tipo: "ventana";

  linea: LineaAluminio;

  cantidad: number;

  medidas: {
    ancho: number;

    alto: number;
  };

  description: string;

  color: string;

  configuracion: {
    tipoVidrio?: VidrioType;

    mosquitero: boolean;

    guia: boolean;

    cajonBlock: boolean;

    cortina: "pvc" | "aluminio" | null;

    premarco: boolean;

    contramarco: boolean;
  };

  subtotal: number;
};

export type VentanaConfig = {
  ancho: number;

  alto: number;

  linea: LineaAluminio;

  tipoVidrio?: VidrioType;

  color: ColorVentana;

  mosquitero: boolean;

  guia: boolean;

  cajonBlock: boolean;

  cortina: "pvc" | "aluminio" | null;

  premarco: boolean;
  vidrioRepartido: boolean;
  contramarco: boolean;
  bipuntoIzquierda: "ninguno" | "normal" | "llave";
  bipuntoDerecha: "ninguno" | "normal" | "llave";
};

export type BudgetItem = {
  id: string;

  descripcion: string;

  ancho: number;

  alto: number;

  linea: string;

  color: string;

  precio: number;
};
