const express = require("express");

const presupuestoController = require("../controllers/presupuestoController");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/nuevo", auth, presupuestoController.nuevoNumero);
router.post("/", auth, presupuestoController.crear);
router.get("/", auth, presupuestoController.listar);
router.get("/:id", auth, presupuestoController.obtener);
router.get("/:id/pdf", auth, presupuestoController.pdf);

module.exports = router;
