function aplicarGananciaCliente(resultado, user) {
  if (!user || !user.margen) return resultado;

  const margen = user.margen;

  return {
    ...resultado,
    total: resultado.total * (1 + margen),
    gananciaCliente: resultado.total * margen,
  };
}

module.exports = aplicarGananciaCliente;
