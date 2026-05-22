import type { BudgetItem } from "../types/budget.types";

type Params = {
  empresa: string;

  cliente?: string;

  items: BudgetItem[];

  total: number;
};

export function budgetToWhatsApp({ empresa, cliente, items, total }: Params) {
  const lines = items.map((item, index) => {
    return `${index + 1}) (${item.cantidad}) - ${item.descripcion}
Subtotal: $ ${item.subtotal.toLocaleString("es-AR")}`;
  });

  return `
*Presupuesto - ${empresa}*

Cliente: ${cliente || "Consumidor Final"}

${lines.join("\n\n")}

*TOTAL: $ ${total.toLocaleString("es-AR")}*
  `.trim();
}
