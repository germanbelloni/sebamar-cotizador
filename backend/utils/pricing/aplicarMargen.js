function aplicarMargen(resultado, margen = 0) {
  const base = resultado.precioVenta || resultado.total || 0;

  const precioFinal = Math.round(base * (1 + margen));

  return {
    ...resultado,

    precioBase: base,

    precioFinal,

    gananciaCliente: precioFinal - base,
  };
}

module.exports = aplicarMargen;
