const Presupuesto = require("../../models/Presupuesto");
const User = require("../../models/User");

const calcularItem = require("./calcularItem");

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

    let recalculado = null;

    try {
      recalculado = calcularItem(
        {
          ...item.configuracion,
          modulo: item.modulo,
          tipo: item.tipo,
          linea:
            item.linea || item.metadata?.linea || item.configuracion?.linea,
          metadata: item.metadata,
          configuracion: item.configuracion,
        },
        usuario.perfil,
      );
    } catch (error) {
      console.warn("No se pudo recalcular item:", item.modulo, error.message);
    }

    const descripcion = item.descripcion || item.tipo || "Producto";

    const precioUnitario = Number(
      recalculado?.precioFinal ??
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

      // =========================
      // SNAPSHOT FINANCIERO
      // =========================

      precioBase: recalculado?.precioBase ?? item.precioBase ?? 0,

      precioLista: recalculado?.precioLista ?? item.precioLista ?? 0,

      precioFinal: recalculado?.precioFinal ?? item.precioFinal ?? subtotal,

      perfilAplicado: recalculado?.perfilAplicado ?? item.perfilAplicado ?? "",

      audit: recalculado?.audit ?? item.audit ?? null,

      metadata: item.metadata || {},

      configuracion: item.configuracion || item,
    };
  });

  usuario.contadorPresupuestos += 1;

  await usuario.save();
  const presupuesto = new Presupuesto({
    userId,
    ownerId,

    numero: usuario.contadorPresupuestos,

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
