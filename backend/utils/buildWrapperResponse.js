function buildWrapperResponse({
  modulo = "",

  linea = "",

  costoBase = 0,

  costo = 0,

  precioBase,

  precioProveedor = 0,

  precioLista,

  precioFinal,

  perfilAplicado = "",

  descuentoAplicado = 0,

  fleteAplicado = 0,

  gananciaAplicada = 0,

  margenAplicado = 0,

  ganancia = 0,

  descripcion = "",

  items = [],

  configuracion = {},

  audit = null,
}) {
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

    precioBase:
      precioBase !== undefined ? Math.round(precioBase) : Math.round(costo),

    precioProveedor: Math.round(precioProveedor),

    precioLista:
      precioLista !== undefined
        ? Math.round(precioLista)
        : Math.round(precioProveedor),

    precioFinal:
      precioFinal !== undefined
        ? Math.round(precioFinal)
        : Math.round(precioLista ?? precioProveedor),

    // Compatibilidad temporal
    precioVenta:
      precioLista !== undefined
        ? Math.round(precioLista)
        : Math.round(precioProveedor),

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
