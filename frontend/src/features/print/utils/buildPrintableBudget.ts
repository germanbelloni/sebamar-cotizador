import type { Cliente } from "@/features/clientes/types";
import type { Empresa } from "@/features/empresa/types";
import type { BudgetItem } from "@/shared/budget/types/budget.types";

export type PrintableBudgetData = {
  empresa: Empresa;
  cliente: Cliente;
  items: BudgetItem[];
};

export function buildPrintableBudget(
  empresa: Empresa,
  cliente: Cliente,
  items: BudgetItem[],
): PrintableBudgetData {
  return {
    empresa,
    cliente,
    items,
  };
}
