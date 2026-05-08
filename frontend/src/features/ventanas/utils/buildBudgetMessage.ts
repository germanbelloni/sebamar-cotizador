import type { VentanaItem } from "../types";

import { formatCurrency } from "./formatCurrency";

export function buildBudgetMessage(items: VentanaItem[]) {
  const total = items.reduce(
    (acc, item) => acc + item.subtotal * item.cantidad,
    0,
  );

  const products = items
    .map((item, index) => {
      return `
${index + 1})
${item.description}

Cantidad: ${item.cantidad}

Subtotal:
${formatCurrency(item.subtotal * item.cantidad)}
`;
    })
    .join("\n");

  return `
PRESUPUESTO SEBAMAR

${products}

TOTAL:
${formatCurrency(total)}
  `
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
