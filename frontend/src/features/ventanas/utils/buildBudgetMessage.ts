import type { Cliente } from "@/features/clientes/types";

import type { VentanaItem } from "../types";

import { formatCurrency } from "./formatCurrency";

export function buildBudgetMessage(items: VentanaItem[], cliente: Cliente) {
  const products = items
    .map((item, index) => {
      return `
${index + 1}) ${item.description}

Cantidad: ${item.cantidad}

Subtotal: ${formatCurrency(item.subtotal * item.cantidad)}
`;
    })
    .join("\n");

  const total = items.reduce(
    (acc, item) => acc + item.subtotal * item.cantidad,
    0,
  );

  const clienteInfo = `
CLIENTE:
${cliente.nombre || "-"}

TEL:
${cliente.telefono || "-"}

`;

  return `
PRESUPUESTO SEBAMAR

${clienteInfo}

${products}

TOTAL:
${formatCurrency(total)}
  `;
}
