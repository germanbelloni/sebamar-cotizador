const Presupuesto = require("../../models/Presupuesto");
const User = require("../../models/User");

async function crearPresupuesto({ user, body }) {
  const userId = user.id;

  let ownerId;

  // SUPERADMIN
  if (user.role === "superadmin") {
    ownerId = user.id;
  }

  // ADMIN
  else if (user.role === "admin") {
    ownerId = user.id;
  }

  // USER
  else {
    ownerId = user.ownerId;
  }

  const usuario = await User.findById(userId);

  if (!usuario) {
    throw new Error("Usuario no encontrado");
  }

  let total = 0;

  const itemsProcesados = body.items.map((item) => {
    const cantidad = item.cantidad || 1;

    const descripcion = item.descripcion || item.tipo || "Producto";

    const precio = item.precioFinal || item.subtotal || item.precio || 0;

    const subtotal = precio * cantidad;

    total += subtotal;

    return {
      tipo: item.tipo,
      modulo: item.modulo,
      titulo: item.titulo,
      cantidad,
      descripcion,
      precio,
      precioUnitario: item.precioUnitario || precio,
      subtotal,
      precioBase: item.precioBase || 0,
      precioLista: item.precioLista || 0,
      precioFinal: item.precioFinal || subtotal,
      margenAplicado: item.margenAplicado || 0,
      perfilAplicado: item.perfilAplicado || "",
      metadata: item.metadata || {},
      configuracion: item,
    };
  });

  usuario.contadorPresupuestos += 1;

  await usuario.save();

  const presupuesto = new Presupuesto({
    userId,

    ownerId,

    numero: usuario.contadorPresupuestos,

    cliente: body.cliente,

    fecha: body.fecha,

    items: itemsProcesados,

    telefono: body.telefono,

    direccion: body.direccion,

    observaciones: body.observaciones,

    validez: body.validez,

    total,

    estado: "pendiente",
  });

  await presupuesto.save();

  return presupuesto;
}

module.exports = crearPresupuesto;
