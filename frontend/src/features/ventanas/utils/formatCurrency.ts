export function formatCurrency(value: number) {
  const hasDecimals = !Number.isInteger(value);

  const formatted = new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: hasDecimals ? 2 : 0,

    maximumFractionDigits: hasDecimals ? 2 : 0,
  })
    .format(value)
    .replace(/\./g, "");

  return `$ ${formatted}`;
}
