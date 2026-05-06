function aplicarGananciaCliente(resultado, user) {
  if (!user || !user.margen) {
    return resultado;
  }

  const margen = user.margen;

  const base = resultado.precioVenta || resultado.total || 0;

  return {
    ...resultado,

    total: Math.round(base * (1 + margen)),

    gananciaCliente: Math.round(base * margen),
  };
}

module.exports = aplicarGananciaCliente;
