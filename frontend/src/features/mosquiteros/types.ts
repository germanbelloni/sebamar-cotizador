export type MosquiteroTipo = "ventana" | "puerta_mosquitera";

export type MosquiterosConfig = {
  ancho: number;

  alto: number;

  tipo: MosquiteroTipo;

  color: "blanco" | "negro" | "bronce colonial" | "simil madera";
};

export type MosquiterosItem = {
  tipo: "mosquiteros";

  cantidad: number;

  medidas: {
    ancho: number;

    alto: number;
  };

  description: string;

  color: string;

  configuracion: {
    tipo: MosquiteroTipo;
  };

  subtotal: number;
};
