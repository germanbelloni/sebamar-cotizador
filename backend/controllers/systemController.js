const SystemConfig = require("../models/SystemConfig");

async function getSystemStatus(req, res) {
  try {
    let config = await SystemConfig.findOne();

    if (!config) {
      config = await SystemConfig.create({});
    }

    res.json({
      mantenimiento: config.mantenimiento,
      mensaje: config.mensaje,
    });
  } catch (error) {
    console.error("Error obteniendo estado del sistema:", error);

    res.status(500).json({
      message: "Error obteniendo estado del sistema",
    });
  }
}

async function updateMaintenance(req, res) {
  try {
    const { mantenimiento, mensaje } = req.body;

    let config = await SystemConfig.findOne();

    if (!config) {
      config = await SystemConfig.create({});
    }

    config.mantenimiento = Boolean(mantenimiento);

    if (mensaje) {
      config.mensaje = mensaje;
    }

    await config.save();

    res.json({
      mantenimiento: config.mantenimiento,
      mensaje: config.mensaje,
    });
  } catch (error) {
    console.error("Error actualizando mantenimiento:", error);

    res.status(500).json({
      message: "Error actualizando mantenimiento",
    });
  }
}

module.exports = {
  getSystemStatus,
  updateMaintenance,
};
