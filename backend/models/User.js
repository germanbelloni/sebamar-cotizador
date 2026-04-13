const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    nombre: String,
    password: String,
    contadorPresupuestos: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
