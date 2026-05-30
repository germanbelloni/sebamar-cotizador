import type { BudgetItem, BudgetModule } from "../types/budget.types";

import { createGroupKey } from "../utils/createGroupKey";

type Params = {
  modulo: BudgetModule;

  titulo: string;

  descripcion: string;

  configuracion: Record<string, unknown>;

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

  // =========================
  // 💰 SNAPSHOT FINANCIERO
  // =========================

  const precioBase = Number(result.precioBase ?? 0);

  const precioLista = Number(
    result.precioVenta ?? result.precioLista ?? result.precioFinal ?? 0,
  );

  const precioFinal = Number(result.precioFinal ?? result.precioVenta ?? 0);

  const margenAplicado = Number(result.margenAplicado ?? 0);

  const perfilAplicado = String(result.perfilAplicado ?? "");
  console.log("BUDGET ITEM RESULT:", result);

  console.log("MARGEN:", result.margenAplicado);

  console.log("PERFIL:", result.perfilAplicado);

  return {
    id: crypto.randomUUID(),

    modulo,

    titulo,

    descripcion,

    cantidad,

    precioUnitario,

    subtotal,

    // =========================
    // 💰 FINANCIERO
    // =========================

    precioBase,

    precioLista,

    precioFinal,

    margenAplicado,

    perfilAplicado,

    configuracion,

    svg,

    metadata,

    groupKey: createGroupKey({
      modulo,
      descripcion,
      metadata,
      configuracion,
    }),
  };
}
