export type VentanaHerreroConfig = {
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
