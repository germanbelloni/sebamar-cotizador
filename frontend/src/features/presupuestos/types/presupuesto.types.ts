export type EstadoPresupuesto = "pendiente" | "aprobado";

export type PresupuestoItem = {
  id?: string;

  tipo?: string;

  modulo: string;

  titulo: string;

  descripcion: string;

  cantidad: number;

  precioUnitario: number;

  subtotal: number;

  precioBase?: number;

  precioProveedor?: number;

  precioLista?: number;

  precioFinal?: number;

  descuentoAplicado?: number;

  fleteAplicado?: number;

  gananciaAplicada?: number;

  margenAplicado?: number;

  perfilAplicado?: string;

  configuracion?: unknown;

  metadata?: unknown;

  audit?: unknown;
};

export type Presupuesto = {
  id: string;

  numero: number;

  cliente?: string;

  telefono?: string;

  direccion?: string;

  observaciones?: string;

  fecha?: string;

  estado: EstadoPresupuesto;

  total: number;

  items: PresupuestoItem[];
  validez?: string;
};
