export type PuertaLinea = "herrero" | "modena" | "eco";

export type PuertaTipoConfiguracion =
  | "simple"
  | "doble"
  | "puerta_y_media"
  | "porton";

export type PuertaTipoPorton = "abrir" | "plegadizo" | "corredizo";

export type PuertaMano = "izquierda" | "derecha";

/* Solo aplica a portón */
export type PuertaHojaPrincipal = 1 | 2 | 3 | 4 | 5 | 6;

export type PuertaVidrio =
  | "3mm"
  | "4mm"
  | "5mm"
  | "fantasia"
  | "esmerilado"
  | "3+3"
  | "dvh_4_9_4"
  | "dvh_5_9_5";

export type PuertasExtras = {
  barralRecto?: number;
  barralCurvo?: number;
  mediaManija?: boolean;
  picaporte?: boolean;
};

export type PuertasConfig = {
  ancho: number;
  alto: number;

  linea: PuertaLinea;

  tipoConfiguracion: PuertaTipoConfiguracion;
  tipoPorton: PuertaTipoPorton;

  modelo: string;
  modeloMediaPuerta?: string;

  color: "blanco" | "negro" | "bronce colonial" | "simil madera";

  mano: PuertaMano;

  /* Solo para portón */
  hojaPrincipal?: PuertaHojaPrincipal;

  hojas: number;
  anchoPrincipal: number;

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
    tipoConfiguracion: PuertaTipoConfiguracion;
    tipoPorton: PuertaTipoPorton;

    modelo: string;
    modeloMediaPuerta?: string;

    mano: PuertaMano;

    /* Solo para portón */
    hojaPrincipal?: PuertaHojaPrincipal;

    hojas: number;
    anchoPrincipal: number;

    vidrio?: PuertaVidrio;

    extras: PuertasExtras;
  };

  subtotal: number;
};
