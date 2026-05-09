export type PostigonesConfig = {
  ancho: number;

  alto: number;

  tipo: "abrir" | "corredizo";

  color: "blanco" | "negro" | "bronce colonial" | "simil madera";

  microperforado: boolean;

  herrajeBlanco: boolean;
};

export type PostigonesItem = {
  tipo: "postigones";

  cantidad: number;

  tipoPostigon: "abrir" | "corredizo";

  medidas: {
    ancho: number;

    alto: number;
  };

  description: string;

  color: string;

  extras: {
    microperforado: boolean;

    herrajeBlanco: boolean;
  };

  subtotal: number;
};
