export function formatCurrency(value: number) {
  const hasDecimals = !Number.isInteger(value);

  if (Math.abs(value) < 1_000_000) {
    return `$ ${hasDecimals ? value.toFixed(2).replace(".", ",") : value}`;
  }

  const formatted = new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: hasDecimals ? 2 : 0,

    maximumFractionDigits: hasDecimals ? 2 : 0,
  }).format(value);

  return `$ ${formatted}`;
}
