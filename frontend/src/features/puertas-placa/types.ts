export type PuertasPlacaTipo = "abrir" | "embutir" | "granero";

export type PuertasPlacaMarco = "marco_10" | "marco_15" | "aluminio";

export type PuertasPlacaModelo =
  | "finger_pino"
  | "finger_cedro"
  | "cedro_cedro"
  | "aluminio_pino"
  | "aluminio_cedro"
  | "granero_z"
  | "granero_finger"
  | "granero_aluminio"
  | "granero_aluminio_sin_herrajes";

export type PuertasPlacaMedida = "60x200" | "70x200" | "80x200";

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
