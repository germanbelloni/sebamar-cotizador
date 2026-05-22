import type { BudgetItem } from "../types/budget.types";

type Params = {
  items: BudgetItem[];
};

export function budgetToApi({ items }: Params) {
  const total = items.reduce((acc, item) => {
    return acc + item.subtotal;
  }, 0);

  return {
    items: items.map((item) => ({
      id: item.id,

      modulo: item.modulo,

      titulo: item.titulo,

      descripcion: item.descripcion,

      cantidad: item.cantidad,

      precioUnitario: item.precioUnitario,

      subtotal: item.subtotal,

      configuracion: item.configuracion,

      metadata: item.metadata,
    })),

    total,
  };
}
