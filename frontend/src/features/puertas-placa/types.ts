export type PuertasPlacaConfig = {
  ancho: number;

  alto: number;

  tipo: string;

  modelo: string;

  marco?: string;

  mano: "izquierda" | "derecha";
};

export type PuertasPlacaItem = {
  tipo: "puerta_placa";

  cantidad: number;

  medidas: {
    ancho: number;

    alto: number;
  };

  description: string;

  configuracion: {
    tipo: string;

    modelo: string;

    marco?: string;

    mano: "izquierda" | "derecha";
  };

  subtotal: number;
};
