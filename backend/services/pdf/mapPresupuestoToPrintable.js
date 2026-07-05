function mapPresupuestoToPrintable(presupuesto, user) {
  return {
    empresa: {
      nombre: user.nombreEmpresa || user.empresa || "Empresa",
      telefono: user.telefono || "",
      direccion: user.direccion || "",
      email: user.email || "",
      logo: user.logo || "",
      primaryColor: user.colorPrimario || "#D6B400",
      secondaryColor: user.colorSecundario || "#1f2937",
    },

    cliente: {
      nombre: presupuesto.cliente || "",
      telefono: presupuesto.telefono || "",
    },

    items: (presupuesto.items || []).map((item) => ({
      id: String(item._id || ""),

      titulo: item.titulo,

      descripcion: item.descripcion,

      cantidad: item.cantidad,

      precioUnitario: item.precioUnitario,

      subtotal: item.subtotal,
      fecha: presupuesto.fecha,
      numero: presupuesto.numero,
    })),
  };
}

module.exports = mapPresupuestoToPrintable;
