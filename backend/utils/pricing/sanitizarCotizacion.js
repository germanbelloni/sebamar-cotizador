function sanitizarResultado(resultado, user) {
  // 👑 SUPERADMIN
  if (user.role === "superadmin") {
    return resultado;
  }

  // 🧑 ADMIN
  if (user.role === "admin") {
    return {
      descripcion: resultado.descripcion,

      precioFinal: resultado.precioFinal || resultado.precioVenta || 0,

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
    precioFinal: resultado.precioFinal || resultado.precioVenta || 0,

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
