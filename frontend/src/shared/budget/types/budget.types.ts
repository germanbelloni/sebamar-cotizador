export type BudgetModule =
  | "ventanas"
  | "rajas"
  | "puertas"
  | "puertas-placa"
  | "postigones"
  | "patagonicas"
  | "mosquiteros"
  | "portones"
  | "marcos"
  | "pano-fijo"
  | "superficies";

export type BudgetItem = {
  id: string;

  modulo: BudgetModule;

  titulo: string;

  descripcion: string;

  cantidad: number;

  precioUnitario: number;

  subtotal: number;

  groupKey: string;

  configuracion: unknown;

  svg?: string;

  precioBase?: number;

  precioLista?: number;

  precioFinal?: number;

  margenAplicado?: number;

  perfilAplicado?: string;

  metadata?: {
    linea?: string;

    color?: string;

    vidrio?: string;
  };
};
