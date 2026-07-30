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

  // Hasta 80
  if (anchoRedondeado <= 80) {
    factor = 0.93;
  }

  // 81 a 90
  else if (anchoRedondeado <= 90) {
    factor = 1.1;
  }

  // Más de 90
  else {
    factor = 1.1;
  }

  console.log("📏 AJUSTE MEDIDA PUERTA:", {
    configuracion,
    anchoOriginal: ancho,
    hojas,
    anchoCobrado: anchoHoja,
    factor,
  });

  if (factor === 1) return;

  items.forEach((item) => {
    item.precio = Math.round(item.precio * factor);
  });
}

module.exports = aplicarAjusteMedidaPuerta;
