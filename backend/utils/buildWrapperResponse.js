function buildWrapperResponse({
  // =========================
  // IDENTIDAD
  // =========================

  modulo = "",
  linea = "",

  // =========================
  // COSTOS
  // =========================

  costoBase = 0,
  costo = 0,

  // =========================
  // PRECIOS
  // =========================

  precioBase,
  precioProveedor = 0,
  precioLista,
  precioFinal,

  // =========================
  // PERFIL
  // =========================

  perfilAplicado = "",
  descuentoAplicado = 0,
  fleteAplicado = 0,
  gananciaAplicada = 0,
  margenAplicado = 0,

  // =========================
  // OTROS
  // =========================

  ganancia = 0,
  descripcion = "",
  items = [],
  configuracion = {},

  audit = null,
}) {
  // =========================
  // NORMALIZACIÓN
  // =========================

  const precioBaseFinal = precioBase !== undefined ? precioBase : costo;

  const precioProveedorFinal = precioProveedor;

  const precioListaFinal =
    precioLista !== undefined ? precioLista : precioProveedorFinal;

  const precioFinalReal =
    precioFinal !== undefined ? precioFinal : precioListaFinal;
  return {
    // =========================
    // IDENTIDAD
    // =========================

    modulo,

    linea,

    // =========================
    // COSTOS
    // =========================

    costoBase: Math.round(costoBase),

    costo: Math.round(costo),

    // =========================
    // PRECIOS
    // =========================

    precioBase: Math.round(precioBaseFinal),

    precioProveedor: Math.round(precioProveedorFinal),

    precioLista: Math.round(precioListaFinal),

    precioFinal: Math.round(precioFinalReal),

    // Compatibilidad temporal
    precioVenta: Math.round(precioListaFinal),

    // =========================
    // PERFIL
    // =========================

    perfilAplicado,

    descuentoAplicado,

    fleteAplicado,

    gananciaAplicada,

    margenAplicado,

    // =========================
    // RESULTADO
    // =========================

    ganancia: Math.round(ganancia),

    descripcion,

    items,

    configuracion,

    // =========================
    // AUDITORÍA
    // =========================

    audit,
  };
}

module.exports = buildWrapperResponse;
