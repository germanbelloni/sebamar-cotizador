export type MarcoTipo = "premarco" | "contramarco";

export type MarcoColor =
  | "blanco"
  | "negro"
  | "bronce colonial"
  | "simil madera";

export type MarcosConfig = {
  ancho: number;

  alto: number;

  tipo: MarcoTipo;

  color?: MarcoColor;
};

export type MarcosItem = {
  tipo: "marcos";

  cantidad: number;

  description: string;

  subtotal: number;

  configuracion: {
    tipo: MarcoTipo;

    ancho: number;

    alto: number;

    color?: MarcoColor;
  };
};
