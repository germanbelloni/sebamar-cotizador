const express = require("express");

const authController = require("../controllers/authController");

const auth = require("../middleware/auth");

const rolesPermitidos = require("../middleware/roles");

const router = express.Router();

// =========================
// 🔑 LOGIN
// =========================

router.post("/login", authController.login);

// =========================
// 👤 USUARIO ACTUAL
// =========================

router.get("/me", auth, authController.me);

// =========================
// 👥 LISTAR USUARIOS
// =========================

router.get("/users", auth, authController.listar);

router.patch(
  "/users/:id/toggle",
  auth,
  rolesPermitidos("superadmin", "admin"),
  authController.toggleActivo,
);

// =========================
// 👑 REGISTER
// SOLO SUPERADMIN
// =========================

router.post(
  "/register",
  auth,
  rolesPermitidos("superadmin", "admin"),
  authController.register,
);

router.patch(
  "/configuracion",
  auth,
  rolesPermitidos("admin", "superadmin"),
  authController.actualizarConfiguracion,
);

module.exports = router;
