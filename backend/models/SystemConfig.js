const mongoose = require("mongoose");

const systemConfigSchema = new mongoose.Schema(
  {
    mantenimiento: {
      type: Boolean,
      default: false,
    },

    mensaje: {
      type: String,
      default: "Estamos realizando tareas de actualización.",
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("SystemConfig", systemConfigSchema);
