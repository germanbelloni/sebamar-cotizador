import type { BudgetItem } from "../types/budget.types";

type Params = {
  empresa: string;
  cliente?: string;
  items: BudgetItem[];
  total: number;
};

export function budgetToWhatsApp({ empresa, cliente, items, total }: Params) {
  const lines = items.map((item) => {
    return `• (${item.cantidad}) ${item.descripcion}
$ ${item.subtotal.toLocaleString("es-AR")}`;
  });

  const clienteLine =
    cliente && cliente !== "Consumidor Final" ? `Cliente: ${cliente}\n\n` : "";

  return `
*${empresa}*

${clienteLine}${lines.join("\n\n")}

*TOTAL: $ ${total.toLocaleString("es-AR")}*
  `.trim();
}
