const EstadisticaUso = require("../models/EstadisticaUso");
const registrarUso = require("../services/estadisticas/registrarUso");

async function registrar(req, res) {
  try {
    const { accion } = req.body;

    const accionesPermitidas = [
      "generarPresupuesto",
      "copiarCarrito",
      "copiarPresupuesto",
    ];

    if (!accionesPermitidas.includes(accion)) {
      return res.status(400).json({
        error: "Acción inválida",
      });
    }

    await registrarUso(req.user.id, accion);

    return res.json({
      ok: true,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Error registrando uso",
    });
  }
}

async function listar(req, res) {
  try {
    if (req.user.role !== "superadmin") {
      return res.status(403).json({
        error: "No autorizado",
      });
    }

    const estadisticas = await EstadisticaUso.find()
      .populate("userId", "nombre")
      .sort({
        ultimaActividad: -1,
      });

    const usuarios = {};

    for (const item of estadisticas) {
      const id = item.userId?._id?.toString();

      if (!id) continue;

      if (!usuarios[id]) {
        usuarios[id] = {
          userId: id,
          usuario: item.userId.nombre,

          generarPresupuesto: 0,
          copiarCarrito: 0,
          copiarPresupuesto: 0,

          dias: Array(8).fill(0),

          ultimos30Dias: 0,

          ultimaActividad: item.ultimaActividad,
        };
      }

      usuarios[id].generarPresupuesto += item.generarPresupuesto || 0;
      usuarios[id].copiarCarrito += item.copiarCarrito || 0;
      usuarios[id].copiarPresupuesto += item.copiarPresupuesto || 0;
      const fechaItem = new Date(item.fecha);

      const hoy = new Date();

      const diffDias = Math.floor((hoy - fechaItem) / (1000 * 60 * 60 * 24));

      const acciones =
        (item.generarPresupuesto || 0) +
        (item.copiarCarrito || 0) +
        (item.copiarPresupuesto || 0);
      if (diffDias >= 0 && diffDias <= 7) {
        usuarios[id].dias[diffDias] += acciones;
      }

      if (diffDias >= 0 && diffDias < 30) {
        usuarios[id].ultimos30Dias += acciones;
      }

      if (item.ultimaActividad > usuarios[id].ultimaActividad) {
        usuarios[id].ultimaActividad = item.ultimaActividad;
      }
    }

    return res.json(Object.values(usuarios));
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Error obteniendo estadísticas",
    });
  }
}

module.exports = {
  registrar,
  listar,
};
