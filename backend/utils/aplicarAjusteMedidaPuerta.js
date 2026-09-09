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
  // 60 a 79 cm  → -7%
  // 80 cm       → base
  // 81 a 90 cm  → +10%
  // +90 cm      → +20%
  // =========================

  if (anchoRedondeado >= 60 && anchoRedondeado <= 79) {
    factor = 0.93;
  } else if (anchoRedondeado === 80) {
    factor = 1;
  } else if (anchoRedondeado >= 81 && anchoRedondeado <= 90) {
    factor = 1.1;
  } else if (anchoRedondeado > 90) {
    factor = 1.2;
  }
  if (factor === 1) return;

  items.forEach((item) => {
    item.precio = Math.round(item.precio * factor);
  });
}

module.exports = aplicarAjusteMedidaPuerta;
