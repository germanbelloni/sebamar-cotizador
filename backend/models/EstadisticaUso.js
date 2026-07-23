const mongoose = require("mongoose");

const EstadisticaUsoSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    fecha: {
      type: String,
      required: true,
      index: true,
    },

    generarPresupuesto: {
      type: Number,
      default: 0,
    },

    copiarCarrito: {
      type: Number,
      default: 0,
    },

    copiarPresupuesto: {
      type: Number,
      default: 0,
    },

    ultimaActividad: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

// Un documento por usuario por día
EstadisticaUsoSchema.index({ userId: 1, fecha: 1 }, { unique: true });

module.exports = mongoose.model("EstadisticaUso", EstadisticaUsoSchema);
