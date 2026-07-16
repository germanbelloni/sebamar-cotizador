const Presupuesto = require("../../models/Presupuesto");
const User = require("../../models/User");

async function crearPresupuesto({ user, body }) {
  const userId = user.id;

  let ownerId;

  // =========================
  // OWNER
  // =========================

  if (user.role === "superadmin") {
    ownerId = user.id;
  } else if (user.role === "admin") {
    ownerId = user.id;
  } else {
    ownerId = user.ownerId;
  }

  const usuario = await User.findById(userId);

  if (!usuario) {
    throw new Error("Usuario no encontrado");
  }

  let total = 0;
  console.log("ITEM GUARDADO:");
  console.log(JSON.stringify(body.items[0], null, 2));
  console.log(JSON.stringify(body.items[0], null, 2));
  const itemsProcesados = body.items.map((item) => {
    const cantidad = Number(item.cantidad || 1);

    // try {
    //   recalculado = calcularItem(
    //     {
    //       ...item.configuracion,
    //       modulo: item.modulo,
    //       tipo: item.tipo,
    //       linea:
    //         item.linea ||
    //         item.metadata?.linea ||
    //         item.configuracion?.linea,
    //       metadata: item.metadata,
    //       configuracion: item.configuracion,
    //     },
    //     usuario.perfil,
    //   );
    // } catch (error) {
    //   console.warn(
    //     "No se pudo recalcular item:",
    //     item.modulo,
    //     error.message,
    //   );
    // }
    const descripcion = item.descripcion || item.tipo || "Producto";

    const precioUnitario = Number(
      item.precioFinal ??
        item.precioLista ??
        item.precioProveedor ??
        item.precio ??
        item.subtotal ??
        0,
    );

    const subtotal = precioUnitario * cantidad;

    total += subtotal;

    return {
      tipo: item.tipo,
      modulo: item.modulo,
      titulo: item.titulo,
      cantidad,
      descripcion,

      precioUnitario,
      subtotal,

      precioBase: item.precioBase ?? 0,
      precioLista: item.precioLista ?? 0,
      precioFinal: item.precioFinal ?? subtotal,
      margenAplicado: item.margenAplicado ?? 0,
      perfilAplicado: item.perfilAplicado ?? "",
      audit: item.audit ?? null,

      metadata: item.metadata || {},
      configuracion: item.configuracion || item,
    };
  });

  const usuarioActualizado = await User.findByIdAndUpdate(
    userId,
    {
      $inc: {
        contadorPresupuestos: 1,
      },
    },
    {
      new: true,
    },
  );
  const presupuesto = new Presupuesto({
    userId,
    ownerId,

    numero: usuarioActualizado.contadorPresupuestos,

    cliente: body.cliente,
    telefono: body.telefono,
    direccion: body.direccion,

    observaciones: body.observaciones,
    validez: body.validez,

    fecha: new Date(),

    estado: "pendiente",

    items: itemsProcesados,

    total,
  });

  await presupuesto.save();

  return presupuesto;
}

module.exports = crearPresupuesto;
