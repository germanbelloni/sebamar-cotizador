const express = require("express");

const productController = require("../controllers/productController");
const auth = require("../middleware/auth");

const router = express.Router();

// 🔐 TODO protegido
//router.use(auth); COMENTTO PARA PROBAR

// =========================
// 🚪 PUERTAS
// =========================
router.post("/puertas", productController.puertas);
router.post("/puertas/eco", productController.puertasEco);
router.post("/portones", productController.portones);

// =========================
// 🪵 PLACAS
// =========================
router.post("/placas", productController.placas);

// =========================
// 🧵 MOSQUITEROS
// =========================
router.post("/mosquiteros", productController.mosquiteros);
// router.post("/mosquiteros/base", productController.mosquiterosBase);
router.post("/mosquiteros/puerta", productController.puertaMosquitera);

// =========================
// 🪟 VENTANAS
// =========================
router.post("/ventanas", productController.ventanas);
// router.post("/ventanas/herrero", productController.ventanasHerrero);

// =========================
// 🔩 OTROS
// =========================
router.post("/rajas", productController.rajas);
// router.post("/rajas/modena", productController.rajasModena);
router.post("/postigones", productController.postigones);
router.post("/patagonicas", productController.patagonicas);
// =========================
// 📦 SUPERFICIES
// =========================
router.post("/superficies", productController.superficies);

module.exports = router;
