import type { ColorVentana } from "./constants";
import type { LineaAluminio } from "@/shared/types/lineas";
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
    mosquitero: boolean;

    guia: boolean;

    cajonBlock: boolean;

    cortinaPVC: boolean;

    cortinaAluminio: boolean;

    premarco: boolean;

    contramarco: boolean;
  };
  subtotal: number;
};

export type VentanaConfig = {
  ancho: number;

  alto: number;

  linea: LineaAluminio;

  color: ColorVentana;

  mosquitero: boolean;

  guia: boolean;

  cajonBlock: boolean;

  cortinaPVC: boolean;

  cortinaAluminio: boolean;

  premarco: boolean;

  contramarco: boolean;
};
