function aplicarMargen(resultado, margen = 0, perfilAplicado = "") {
  const margenNumero = Number(margen || 0);

  const margenDecimal = margenNumero / 100;

  const base = resultado.precioVenta || resultado.total || 0;

  const precioFinal = Math.round(base * (1 + margenDecimal));

  return {
    ...resultado,

    precioBase: base,

    precioLista: base,

    precioFinal,

    margenAplicado: margenNumero,

    perfilAplicado,

    gananciaCliente: precioFinal - base,
  };
}

module.exports = aplicarMargen;
