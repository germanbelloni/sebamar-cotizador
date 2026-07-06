import type { Cliente } from "@/features/clientes/types";
import type { Empresa } from "@/features/empresa/types";
import type { BudgetItem } from "@/shared/budget/types/budget.types";

export type PrintableBudgetData = {
  numero: number;
  fecha: string;

  empresa: Empresa;
  cliente: Cliente;
  items: BudgetItem[];
};

export function buildPrintableBudget(
  numero: number,
  empresa: Empresa,
  cliente: Cliente,
  items: BudgetItem[],
): PrintableBudgetData {
  return {
    numero,
    fecha: new Date().toISOString(),

    empresa,
    cliente,
    items,
  };
}
