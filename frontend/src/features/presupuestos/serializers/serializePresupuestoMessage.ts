type PresupuestoItem = {
  cantidad: number;
  descripcion: string;
  precioUnitario: number;
  subtotal: number;
};

type Presupuesto = {
  cliente?: string;
  items: PresupuestoItem[];
  total: number;
};

function formatPrecio(valor: number) {
  return valor >= 1_000_000
    ? valor.toLocaleString("es-AR")
    : String(Math.round(valor));
}

export function serializePresupuestoMessage({ items, total }: Presupuesto) {
  const lines = items.map((item) => {
    return [
      `(${item.cantidad}) ${item.descripcion}`,
      `$ ${formatPrecio(item.precioUnitario)} c/u`,
      `Total: $ ${formatPrecio(item.subtotal)}`,
    ].join("\n");
  });

  return `
${lines.join("\n\n")}

TOTAL: $ ${total.toLocaleString("es-AR")}
`.trim();
}
