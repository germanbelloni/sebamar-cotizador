function buildAuditSnapshot({
  version = 1,

  modulo = "",

  linea = "",

  perfil = "",

  costoBase = 0,

  costoFinal = 0,

  precioProveedor = 0,

  precioLista = 0,

  precioFinal = 0,

  descuentoAplicado = 0,

  fleteAplicado = 0,

  gananciaAplicada = 0,

  margenAplicado = 0,

  ganancia = 0,

  pasos = [],
}) {
  return {
    version,

    fecha: new Date().toISOString(),

    modulo,

    linea,

    perfil,

    costoBase: Math.round(costoBase),

    costoFinal: Math.round(costoFinal),

    precioProveedor: Math.round(precioProveedor),

    precioLista: Math.round(precioLista),

    precioFinal: Math.round(precioFinal),

    descuentoAplicado,

    fleteAplicado,

    gananciaAplicada,

    margenAplicado,

    ganancia: Math.round(ganancia),

    pasos,
  };
}

module.exports = buildAuditSnapshot;
