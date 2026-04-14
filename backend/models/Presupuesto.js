const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  descripcion: String,
  cantidad: Number,
  precio: Number,
});

const presupuestoSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    numero: Number,
    cliente: String,
    fecha: String,
    items: [itemSchema],
    total: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Presupuesto", presupuestoSchema);