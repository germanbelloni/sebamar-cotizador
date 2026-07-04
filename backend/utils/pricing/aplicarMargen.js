function aplicarMargen(resultado, margen = 0, perfilAplicado = "") {
  const margenNumero = Number(margen || 0);

  const margenDecimal = margenNumero / 100;

  const base = Number(resultado.precioVenta || resultado.precioFinal || 0);

  const precioFinal = Math.round(base * (1 + margenDecimal));

  return {
    ...resultado,

    // NO tocar el snapshot financiero original
    precioFinal,

    margenAplicado: margenNumero,

    perfilAplicado,

    gananciaCliente: precioFinal - base,
  };
}

module.exports = aplicarMargen;
