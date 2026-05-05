const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    contadorPresupuestos: {
      type: Number,
      default: 0,
    },

    // 🔐 ROLES
    role: {
      type: String,
      enum: ["superadmin", "admin", "user"],
      default: "user",
    },

    // 📊 PERFIL (tu lista de precios)
    perfil: {
      type: String,
      enum: ["amarilla", "azul", "verde"],
      default: "amarilla",
    },

    // 💰 MARGEN DEL CLIENTE
    margen: {
      type: Number,
      default: 0,
    },

    // 🏢 EMPRESA (nombre visible)
    empresa: {
      type: String,
      default: "sebamar",
    },

    // 🧠 RELACIÓN (QUIÉN ES EL DUEÑO)
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // 🎨 BRANDING (para front + PDF)
    logo: {
      type: String,
      default: "",
    },

    colorTema: {
      type: String,
      default: "#000000",
    },

    // 🔒 ACTIVO / INACTIVO
    activo: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
