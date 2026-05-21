export type PuertasPlacaTipo = "abrir" | "embutir" | "granero";

export type PuertasPlacaMarco = "marco_10" | "marco_15" | "aluminio";

export type PuertasPlacaModelo =
  | "finger_pino"
  | "finger_cedro"
  | "cedro_pino"
  | "cedro_cedro"
  | "aluminio_pino"
  | "aluminio_cedro";

export type PuertasPlacaMedida =
  | "60x200"
  | "70x200"
  | "80x200"
  | "140x200"
  | "160x200"
  | "180x200";

export type PuertasPlacaConfig = {
  ancho: number;

  alto: number;

  tipo: PuertasPlacaTipo;

  modelo: PuertasPlacaModelo;

  marco: PuertasPlacaMarco;

  mano: "izquierda" | "derecha";

  fueraDeMedida?: boolean;

  medidaSeleccionada?: string;
};

export type PuertasPlacaItem = {
  tipo: "puertas-placa";

  cantidad: number;

  medidas: {
    ancho: number;

    alto: number;
  };

  description: string;

  configuracion: {
    tipo: PuertasPlacaTipo;

    modelo: PuertasPlacaModelo;

    marco: PuertasPlacaMarco;

    mano: "izquierda" | "derecha";
  };

  subtotal: number;
};
