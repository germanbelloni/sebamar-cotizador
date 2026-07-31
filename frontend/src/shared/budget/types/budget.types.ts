export type BudgetModule =
  | "ventanas"
  | "ventanas-abrir"
  | "rajas"
  | "puertas"
  | "puertas-placa"
  | "postigones"
  | "patagonicas"
  | "mosquiteros"
  | "portones"
  | "marcos"
  | "pano-fijo"
  | "superficies"
  | "cortinas";

export type BudgetItem = {
  id: string;

  tipo?: string;

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

  precioProveedor?: number;

  precioLista?: number;

  precioFinal?: number;

  descuentoAplicado?: number;

  fleteAplicado?: number;

  gananciaAplicada?: number;

  margenAplicado?: number;

  perfilAplicado?: string;

  audit?: unknown;

  metadata?: {
    linea?: string;

    color?: string;

    vidrio?: string;
  };
};
