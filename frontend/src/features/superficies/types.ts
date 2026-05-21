export type SuperficieTipo = "pano-fijo" | "premarco" | "contramarco";

export type SuperficieLinea = "herrero" | "modena";

export type SuperficieVidrio =
  | "3mm"
  | "4mm"
  | "5mm"
  | "6mm"
  | "fantasia"
  | "esmerilado"
  | "3+3"
  | "4+4"
  | "5+5"
  | "dvh";

export type SuperficiesConfig = {
  tipo: SuperficieTipo;

  ancho: number;

  alto: number;

  linea?: SuperficieLinea;

  color: "blanco" | "negro" | "bronce colonial" | "simil madera";

  tipoVidrio?: SuperficieVidrio;
};

export type SuperficiesItem = {
  tipo: "superficies";

  cantidad: number;

  medidas: {
    ancho: number;

    alto: number;
  };

  description: string;

  color: string;

  configuracion: {
    tipo: SuperficieTipo;

    linea?: SuperficieLinea;

    tipoVidrio?: SuperficieVidrio;
  };

  subtotal: number;
};
