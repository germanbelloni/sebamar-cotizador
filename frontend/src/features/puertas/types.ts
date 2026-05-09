export type PuertaLinea = "herrero" | "modena" | "eco";

export type PuertaTipo = "simple" | "corredizo" | "plegadizo";

export type PuertaApertura = "izquierda" | "derecha";

export type PuertaVidrio =
  | "3mm"
  | "4mm"
  | "5mm"
  | "fantasia"
  | "esmerilado"
  | "3+3";

export type PuertasExtras = {
  barralRecto?: number;

  barralCurvo?: number;

  manija?: boolean;

  picaporte?: boolean;
};

export type PuertasConfig = {
  ancho: number;

  alto: number;

  linea: PuertaLinea;

  tipo: PuertaTipo;

  modelo: string;

  color: "blanco" | "negro" | "bronce colonial" | "simil madera";

  apertura: PuertaApertura;

  hojas: number;

  vidrio?: PuertaVidrio;

  extras: PuertasExtras;
};

export type PuertasItem = {
  tipo: "puertas";

  cantidad: number;

  linea: PuertaLinea;

  medidas: {
    ancho: number;

    alto: number;
  };

  description: string;

  color: string;

  configuracion: {
    tipo: PuertaTipo;

    modelo: string;

    apertura: PuertaApertura;

    hojas: number;

    vidrio?: PuertaVidrio;

    extras: PuertasExtras;
  };

  subtotal: number;
};
