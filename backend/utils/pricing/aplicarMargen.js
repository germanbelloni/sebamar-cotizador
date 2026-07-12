function aplicarMargen(resultado, margen = 0, perfilAplicado = "") {
  const margenNumero = Number(margen || 0);

  const margenDecimal = margenNumero / 100;

  const base = Number(resultado.precioVenta || resultado.precioFinal || 0);

  const precioFinal = Math.round(base * (1 + margenDecimal));

  return {
    ...resultado,

    precioFinal,

    margenAplicado: margenNumero || resultado.margenAplicado,

    perfilAplicado: perfilAplicado || resultado.perfilAplicado,

    gananciaCliente: precioFinal - base,
  };
}

module.exports = aplicarMargen;
