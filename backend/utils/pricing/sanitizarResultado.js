function sanitizarResultado(resultado, user) {
  // 👑 SUPERADMIN
  if (user.role === "superadmin") {
    return resultado;
  }

  // 🧑 ADMIN
  if (user.role === "admin") {
    return {
      descripcion: resultado.descripcion,

      precioBase: resultado.precioBase,

      precioFinal: resultado.precioFinal,

      gananciaCliente: resultado.gananciaCliente,

      svg: resultado.svg,
    };
  }

  // 👨 USER
  return {
    descripcion: resultado.descripcion,

    precioFinal: resultado.precioFinal,

    svg: resultado.svg,
  };
}

module.exports = sanitizarResultado;
