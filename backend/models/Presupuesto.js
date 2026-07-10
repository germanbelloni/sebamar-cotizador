const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  modulo: String,

  titulo: String,

  descripcion: String,

  cantidad: Number,

  precioUnitario: Number,

  subtotal: Number,

  precioBase: Number,

  precioProveedor: Number,

  precioLista: Number,

  precioFinal: Number,

  descuentoAplicado: Number,

  fleteAplicado: Number,

  gananciaAplicada: Number,

  margenAplicado: Number,

  perfilAplicado: String,

  audit: mongoose.Schema.Types.Mixed,

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

      enum: ["pendiente", "aprobado"],

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
// =========================
// 📈 ÍNDICES
// =========================

presupuestoSchema.index({
  ownerId: 1,
  createdAt: -1,
});

presupuestoSchema.index({
  userId: 1,
  createdAt: -1,
});

presupuestoSchema.index({
  ownerId: 1,
  numero: -1,
});

presupuestoSchema.index({
  ownerId: 1,
  estado: 1,
});
module.exports = mongoose.model("Presupuesto", presupuestoSchema);
