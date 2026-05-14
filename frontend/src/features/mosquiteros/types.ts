export type MosquiteroTipo = "ventana" | "puerta_mosquitera" | "fijo";

export type MosquiterosConfig = {
  ancho: number;

  alto: number;

  tipo: MosquiteroTipo;

  color: "blanco" | "negro" | "bronce colonial" | "simil madera";

  ladoBisagra: "izquierda" | "derecha";
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
