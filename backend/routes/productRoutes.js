const express = require("express");

const productController = require("../controllers/productController");

const auth = require("../middleware/auth");

const router = express.Router();

// 🔐 TODO PROTEGIDO
router.use(auth);

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

// =========================
// 🪟 VENTANAS
// =========================

router.post("/ventanas", productController.ventanas);
router.post("/ventanas-abrir", productController.ventanasAbrir);

// =========================
// 🔩 RAJAS
// =========================

router.post("/rajas", productController.rajas);

// =========================
// 🪵 OTROS
// =========================

router.post("/postigones", productController.postigones);
router.post("/patagonicas", productController.patagonicas);

// =========================
// 📦 SUPERFICIES
// =========================

router.post("/superficies", productController.superficies);
router.post("/cortinas", productController.cortinas);

module.exports = router;
