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

export function serializePresupuestoMessage({ items, total }: Presupuesto) {
  const lines = items.map((item) => {
    return [
      `(${item.cantidad}) ${item.descripcion}`,
      `$ ${item.precioUnitario.toLocaleString("es-AR")} c/u`,
      `Total: $ ${item.subtotal.toLocaleString("es-AR")}`,
    ].join("\n");
  });

  return `
${lines.join("\n\n")}

TOTAL: $ ${total.toLocaleString("es-AR")}
`.trim();
}
