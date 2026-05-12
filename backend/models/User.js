const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // 🔐 LOGIN
    nombre: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    // 📊 NUMERACIÓN PRESUPUESTOS
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

    // 📊 PERFIL DE PRECIOS
    perfil: {
      type: String,
      enum: ["amarilla", "azul", "verde"],
      default: "amarilla",
    },

    // 💰 GANANCIA
    // ejemplo:
    // 0.20 = 20%
    margen: {
      type: Number,
      default: 0,
    },

    // 🏢 EMPRESA
    empresa: {
      type: String,
      default: "sebamar",
    },

    // 👑 OWNER
    // USER → apunta al ADMIN
    // ADMIN → apunta al SUPERADMIN
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // 🎨 BRANDING
    logo: {
      type: String,
      default: "",
    },

    colorTema: {
      type: String,
      default: "#000000",
    },

    // 🔒 ESTADO
    activo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", userSchema);
