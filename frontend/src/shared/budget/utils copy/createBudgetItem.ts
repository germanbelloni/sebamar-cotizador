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
      result.precioFinal ??
      result.precioVenta ??
      result.subtotal ??
      0,
  );

  const subtotal = precioUnitario * cantidad;

  // =========================
  // 💰 SNAPSHOT FINANCIERO
  // =========================
  const precioBase = Number(result.precioBase ?? 0);

  const precioProveedor = Number(result.precioProveedor ?? result.costo ?? 0);

  const precioLista = Number(
    result.precioLista ??
      result.precioVenta ??
      result.precioProveedor ??
      result.precioFinal ??
      0,
  );

  const precioFinal = Number(
    result.precioFinal ??
      result.precioLista ??
      result.precioVenta ??
      result.precioProveedor ??
      0,
  );

  const descuentoAplicado = Number(result.descuentoAplicado ?? 0);

  const fleteAplicado = Number(result.fleteAplicado ?? 0);

  const gananciaAplicada = Number(result.gananciaAplicada ?? 0);

  const margenAplicado = Number(result.margenAplicado ?? 0);

  const perfilAplicado = String(result.perfilAplicado ?? "");

  const audit = result.audit;
  console.log("CREATE BUDGET ITEM");
  console.log({
    precioBase,
    precioProveedor,
    precioLista,
    precioFinal,
    precioUnitario,
    audit,
  });
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

    precioProveedor,

    precioLista,

    precioFinal,

    descuentoAplicado,

    fleteAplicado,

    gananciaAplicada,

    margenAplicado,

    perfilAplicado,

    audit,

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
