function aplicarAjusteMedidaPuerta(items, ancho) {
  const anchoRedondeado = Math.round(ancho);

  let factor = 1;

  if (anchoRedondeado === 70) {
    factor = 0.93;
  } else if (anchoRedondeado === 90) {
    factor = 1.1;
  }

  if (factor === 1) return;

  items.forEach((item) => {
    item.precio = Math.round(item.precio * factor);
  });
}

module.exports = aplicarAjusteMedidaPuerta;
