import type { BudgetItem } from "../types/budget.types";

type Params = {
  empresa: string;
  cliente?: string;
  items: BudgetItem[];
  total: number;
};

export function budgetToWhatsApp({ empresa, items, total }: Params) {
  const lines = items.map(
    (item) =>
      `• (${item.cantidad}) ${item.descripcion}\n$ ${item.subtotal.toLocaleString("es-AR")}`,
  );

  return `
*${empresa}*

${lines.join("\n\n")}

*TOTAL: $ ${total.toLocaleString("es-AR")}*
`.trim();
}
