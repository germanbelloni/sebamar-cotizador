import type { LineaAluminio } from "@/shared/types/lineas";

export type PortonSistema = "abrir" | "corredizo" | "plegadizo";

export type PortonVidrio = "3mm" | "4mm" | "5mm" | "3+3" | "dvh" | "dvh_5_9_5";

export type PortonesExtras = {
  barralRecto?: number;
  barralCurvo?: number;
  picaporte?: boolean;
  mediaManija?: boolean;
  dobleTravesano?: boolean;
  cartelprohibido?: boolean;
};

export type PortonesConfig = {
  ancho: number;

  alto: number;

  linea: LineaAluminio;

  sistema: PortonSistema;

  hojas: 3 | 4 | 5 | 6;

  modelo: string;

  color: "blanco" | "negro" | "bronce colonial" | "simil madera";

  tipoVidrio?: PortonVidrio;

  extras: PortonesExtras;
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

    hojas: 3 | 4 | 5 | 6;

    modelo: string;

    tipoVidrio?: PortonVidrio;

    extras: PortonesExtras;
  };

  subtotal: number;
};
