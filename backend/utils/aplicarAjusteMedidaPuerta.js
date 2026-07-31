function aplicarAjusteMedidaPuerta(
  items,
  ancho,
  configuracion = "simple",
  hojas = 1,
) {
  let anchoHoja = ancho;

  // =========================
  // DOBLE / PORTON
  // =========================

  if ((configuracion === "doble" || configuracion === "porton") && hojas > 1) {
    anchoHoja = ancho / hojas;
  }

  // =========================
  // PUERTA Y MEDIA
  // =========================

  if (configuracion === "puerta_y_media") {
    return;
  }

  const anchoRedondeado = Math.round(anchoHoja);

  let factor = 1;

  // =========================
  // REGLA COMERCIAL PUERTAS
  //
  // 60 a 79 cm  → -10%
  // 80 cm       → base
  // 81 a 90 cm  → +10%
  // +90 cm      → +10% +10%
  // =========================

  if (anchoRedondeado < 80) {
    factor = 0.9;
  } else if (anchoRedondeado === 80) {
    factor = 1;
  } else if (anchoRedondeado <= 90) {
    factor = 1.1;
  } else {
    factor = 1.21;
  }
  if (factor === 1) return;

  items.forEach((item) => {
    item.precio = Math.round(item.precio * factor);
  });
}

module.exports = aplicarAjusteMedidaPuerta;
