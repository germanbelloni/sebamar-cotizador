function calcularPrecio(config, input) {
  let precio = 0;

  // 1. BASE
  precio = calcularBase(config, input);

  // 2. COLOR
  if (config.calculo.usa_color) {
    precio = aplicarColor(precio, config, input);
  }

  // 3. VIDRIO
  if (config.calculo.usa_vidrio) {
    precio = aplicarVidrio(precio, config, input);
  }

  // 4. MEDIDAS
  if (config.calculo.usa_medidas) {
    precio = aplicarMedidas(precio, config, input);
  }

  // 5. ADICIONALES
  precio = aplicarAdicionales(precio, input);

  // 6. DESCUENTO
  precio = aplicarDescuento(precio, input);

  // 7. FINALES
  precio = aplicarFinales(precio, input);

  return precio;
}

module.exports = { calcularPrecio };