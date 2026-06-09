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

    // 💰 MARGEN

    margen: {
      type: Number,
      default: 0,
    },

    // 🏢 EMPRESA

    empresa: {
      type: String,
      default: "sebamar",
    },

    nombreEmpresa: {
      type: String,
      default: "",
    },

    // 👑 OWNER

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

    telefono: {
      type: String,
      default: "",
    },

    direccion: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      default: "",
    },

    observacionesPdf: {
      type: String,
      default: "",
    },

    colorPrimario: {
      type: String,
      default: "#D6B400",
    },

    colorSecundario: {
      type: String,
      default: "#1f2937",
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
