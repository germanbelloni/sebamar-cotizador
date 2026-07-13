function sanitizarResultado(resultado, user) {
  // 👑 SUPERADMIN
  if (user.role === "superadmin") {
    return resultado;
  }

  // 🧑 ADMIN
  if (user.role === "admin") {
    return {
      descripcion: resultado.descripcion,

      precioBase:
        resultado.precioLista ||
        resultado.precioProveedor ||
        resultado.precioBase ||
        0,

      precioFinal: resultado.precioFinal || resultado.precioVenta || 0,

      gananciaCliente: resultado.gananciaCliente,

      margenAplicado: resultado.margenAplicado,
      perfilAplicado: resultado.perfilAplicado,

      svg: resultado.svg,

      configuracion: resultado.configuracion,

      items:
        resultado.items?.map((item) => ({
          ...item,

          subtotal: item.subtotal || item.precio || 0,
        })) || [],
    };
  }

  // 👨 USER
  return {
    descripcion: resultado.descripcion,

    precioBase: resultado.precioBase,

    precioFinal: resultado.precioFinal || resultado.precioVenta || 0,

    margenAplicado: resultado.margenAplicado,

    perfilAplicado: resultado.perfilAplicado,

    svg: resultado.svg,

    configuracion: resultado.configuracion,

    items:
      resultado.items?.map((item) => ({
        ...item,

        subtotal: item.subtotal || item.precio || 0,
      })) || [],
  };
}

module.exports = sanitizarResultado;
