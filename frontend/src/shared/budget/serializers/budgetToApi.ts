import type { BudgetItem } from "../types/budget.types";

type Params = {
  items: BudgetItem[];

  cliente?: string;

  telefono?: string;
};

export function budgetToApi({ items, cliente, telefono }: Params) {
  const total = items.reduce((acc, item) => {
    return acc + item.subtotal;
  }, 0);

  return {
    cliente,

    telefono,

    items: items.map((item) => ({
      id: item.id,

      tipo: item.modulo,

      modulo: item.modulo,

      titulo: item.titulo,

      descripcion: item.descripcion,

      cantidad: item.cantidad,

      precio: item.precioUnitario,

      precioUnitario: item.precioUnitario,

      subtotal: item.subtotal,

      configuracion: item.configuracion,

      metadata: item.metadata,
    })),

    total,
  };
}
