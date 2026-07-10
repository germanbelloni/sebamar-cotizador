const Presupuesto = require("../models/Presupuesto");
const User = require("../models/User");

async function duplicar(req, res) {
  try {
    const original = await Presupuesto.findById(req.params.id);

    if (!original) {
      return res.status(404).json({
        error: "Presupuesto no encontrado",
      });
    }

    // 👑 SUPERADMIN
    if (req.user.role === "superadmin") {
      // acceso total
    }

    // 🧑 ADMIN
    else if (req.user.role === "admin") {
      if (original.ownerId?.toString() !== req.user.id) {
        return res.status(403).json({
          error: "No autorizado",
        });
      }
    }

    // 👨 USER
    else {
      if (original.userId?.toString() !== req.user.id) {
        return res.status(403).json({
          error: "No autorizado",
        });
      }
    }
    const usuario = await User.findById(req.user.id);

    if (!usuario) {
      return res.status(404).json({
        error: "Usuario no encontrado",
      });
    }

    usuario.contadorPresupuestos += 1;

    await usuario.save();

    const nuevo = new Presupuesto({
      ...original.toObject(),

      _id: undefined,

      numero: usuario.contadorPresupuestos,

      estado: "pendiente",

      createdAt: undefined,
      updatedAt: undefined,
    });

    await nuevo.save();

    return res.json({
      ok: true,
      id: nuevo._id,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Error duplicando presupuesto",
    });
  }
}

module.exports = {
  duplicar,
};
