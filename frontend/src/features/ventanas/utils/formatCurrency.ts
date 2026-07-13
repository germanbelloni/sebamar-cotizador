export function formatCurrency(value: number) {
  const hasDecimals = !Number.isInteger(value);

  let formatted: string;

  if (Math.abs(value) < 1000000) {
    formatted = new Intl.NumberFormat("es-AR", {
      minimumFractionDigits: hasDecimals ? 2 : 0,
      maximumFractionDigits: hasDecimals ? 2 : 0,
    })
      .format(value)
      .replace(/\./g, "");
  } else {
    formatted = new Intl.NumberFormat("es-AR", {
      minimumFractionDigits: hasDecimals ? 2 : 0,
      maximumFractionDigits: hasDecimals ? 2 : 0,
    }).format(value);
  }

  return `$ ${formatted}`;
}
