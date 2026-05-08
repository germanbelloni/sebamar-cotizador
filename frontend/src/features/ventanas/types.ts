export type VentanaItem = {
  tipo: "ventana";

  linea: "Herrero" | "Modena";
  cantidad: number;

  medidas: {
    ancho: number;
    alto: number;
  };
  description: string;

  color: string;

  extras: {
    mosquitero: boolean;

    guia: boolean;

    cajonBlock: boolean;

    cortinaPVC: boolean;

    cortinaAluminio: boolean;

    premarco: boolean;

    contramarco: boolean;
  };
  subtotal: number;
};

export type VentanaConfig = {
  ancho: number;

  alto: number;

  linea: "Herrero" | "Modena";

  color: "Blanco" | "Negro" | "Bronce Colonial" | "Simil Madera";

  mosquitero: boolean;

  guia: boolean;

  cajonBlock: boolean;

  cortinaPVC: boolean;

  cortinaAluminio: boolean;

  premarco: boolean;

  contramarco: boolean;
};

export type BudgetItem = {
  id: string;

  descripcion: string;

  ancho: number;

  alto: number;

  linea: string;

  color: string;

  precio: number;
};
