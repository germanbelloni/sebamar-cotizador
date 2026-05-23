const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  modulo: String,

  titulo: String,

  descripcion: String,

  cantidad: Number,

  precioUnitario: Number,

  subtotal: Number,

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
    items: [itemSchema],
    total: Number,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Presupuesto", presupuestoSchema);
