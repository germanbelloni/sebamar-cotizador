import type { BudgetItem } from "../types/budget.types";

type Params = {
  empresa: string;
  cliente?: string;
  items: BudgetItem[];
  total: number;
};

function formatPrecio(valor: number) {
  return valor >= 1_000_000
    ? valor.toLocaleString("es-AR")
    : String(Math.round(valor));
}

export function budgetToWhatsApp({ items, total }: Params) {
  const lines = items.map(
    (item) =>
      `• (${item.cantidad}) ${item.descripcion} - $ ${formatPrecio(item.subtotal)}`,
  );

  return `
${lines.join("\n\n")}

*TOTAL: $ ${formatPrecio(total)}*
`.trim();
}
