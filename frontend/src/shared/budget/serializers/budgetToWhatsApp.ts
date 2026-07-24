import type { BudgetItem } from "../types/budget.types";

type Params = {
  empresa: string;
  cliente?: string;
  items: BudgetItem[];
  total: number;
};

export function budgetToWhatsApp({ cliente, items, total }: Params) {
  const lines = items.map(
    (item) =>
      `• (${item.cantidad}) ${item.descripcion} - $ ${item.subtotal.toLocaleString("es-AR")}`,
  );

  return `
${cliente ? `*Cliente:* ${cliente}\n` : ""}
${lines.join("\n\n")}

*TOTAL: $ ${total.toLocaleString("es-AR")}*
`.trim();
}
