import type { BudgetItem, BudgetModule } from "../types/budget.types";

type Params = {
  modulo: BudgetModule;

  titulo: string;

  descripcion: string;

  configuracion: unknown;

  result: Record<string, unknown>;

  svg?: string;

  metadata?: {
    linea?: string;

    color?: string;

    vidrio?: string;
  };
};

export function createBudgetItem({
  modulo,
  titulo,
  descripcion,
  configuracion,
  result,
  svg,
  metadata,
}: Params): BudgetItem {
  const cantidad = Number(
    (configuracion as { cantidad?: number })?.cantidad ?? 1,
  );

  const precioUnitario = Number(
    result.precioUnitario ??
      result.precioVenta ??
      result.precioFinal ??
      result.subtotal ??
      0,
  );

  const subtotal = precioUnitario * cantidad;

  return {
    id: crypto.randomUUID(),

    modulo,

    titulo,

    descripcion,

    cantidad,

    precioUnitario,

    subtotal,

    configuracion,

    svg,

    metadata,
    groupKey: crypto.randomUUID(),
  };
}
