import type { LineaAluminio } from "@/shared/types/lineas";

export type PortonSistema = "corredizo" | "plegadizo" | "levadizo";

export type PortonVidrio = "3mm" | "4mm" | "5mm" | "3+3" | "dvh";

export type PortonesConfig = {
  ancho: number;

  alto: number;

  linea: LineaAluminio;

  sistema: PortonSistema;

  hojas: number;

  color: "blanco" | "negro" | "bronce colonial" | "simil madera";

  tipoVidrio?: PortonVidrio;

  automatizado: boolean;

  guiaInferior: boolean;
};

export type PortonesItem = {
  tipo: "portones";

  cantidad: number;

  linea: LineaAluminio;

  medidas: {
    ancho: number;

    alto: number;
  };

  description: string;

  color: string;

  configuracion: {
    sistema: PortonSistema;

    hojas: number;

    tipoVidrio?: PortonVidrio;

    automatizado: boolean;

    guiaInferior: boolean;
  };

  subtotal: number;
};
