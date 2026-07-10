export type PanoFijoLinea = "herrero" | "modena";

export type PanoFijoColor =
  | "blanco"
  | "negro"
  | "bronce colonial"
  | "simil madera";

export type PanoFijoVidrio =
  | "3mm"
  | "4mm"
  | "5mm"
  | "fantasia"
  | "esmerilado"
  | "3+3"
  | "4+4"
  | "dvh_4_9_4"
  | "dvh_5_9_5";

export type PanoFijoConfig = {
  ancho: number;
  alto: number;
  linea: PanoFijoLinea;
  color: PanoFijoColor;
  tipoVidrio: PanoFijoVidrio;

  travesanoVertical: boolean;
  travesanoHorizontal: boolean;

  premarco: boolean;
  contramarco: boolean;
};

export type PanoFijoItem = {
  tipo: "pano-fijo";

  cantidad: number;

  medidas: {
    ancho: number;

    alto: number;
  };

  description: string;

  color: string;

  configuracion: {
    linea: PanoFijoLinea;

    tipoVidrio: PanoFijoVidrio;
  };

  subtotal: number;
};
