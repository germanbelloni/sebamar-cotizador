function buildAuditStep({
  // Identidad
  etapa = "",
  tipo = "",
  descripcion = "",

  // Origen
  origen = "",
  referencia = "",

  // Cálculo
  valorAntes = 0,
  valorAplicado = 0,
  valorDespues = 0,
  porcentaje = null,

  // Extra
  metadata = {},
}) {
  return {
    timestamp: new Date().toISOString(),

    etapa,
    tipo,

    descripcion,

    origen,

    referencia,

    valorAntes: Number(valorAntes || 0),

    valorAplicado: Number(valorAplicado || 0),

    valorDespues: Number(valorDespues || 0),

    porcentaje,

    diferencia: Number(
      (Number(valorDespues || 0) - Number(valorAntes || 0)).toFixed(2),
    ),

    metadata,
  };
}

module.exports = buildAuditStep;
