function aplicarGananciaCliente(resultado, user) {
  if (!user || !user.margen) {
    return resultado;
  }

  const margen = Number(user.margen || 0);

  const base = Number(
    resultado.precioFinal ?? resultado.precioVenta ?? resultado.total ?? 0,
  );

  const precioFinal = Math.round(base * (1 + margen));

  return {
    ...resultado,

    precioFinal,

    gananciaCliente: Math.round(precioFinal - base),
  };
}

module.exports = aplicarGananciaCliente;
