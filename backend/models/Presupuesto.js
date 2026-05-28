const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  modulo: String,

  titulo: String,

  descripcion: String,

  cantidad: Number,

  precioUnitario: Number,

  subtotal: Number,

  precioBase: Number,

  precioLista: Number,

  precioFinal: Number,

  margenAplicado: Number,

  perfilAplicado: String,

  configuracion: mongoose.Schema.Types.Mixed,

  metadata: mongoose.Schema.Types.Mixed,
});

const presupuestoSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    numero: Number,

    cliente: String,

    telefono: String,

    direccion: String,

    observaciones: String,

    validez: String,

    fecha: String,

    // =========================
    // 🔄 ESTADO
    // =========================

    estado: {
      type: String,

      enum: ["pendiente", "enviado", "aprobado", "rechazado"],

      default: "pendiente",
    },

    // =========================
    // 📦 ITEMS
    // =========================

    items: [itemSchema],

    // =========================
    // 💰 TOTAL
    // =========================

    total: Number,
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Presupuesto", presupuestoSchema);
