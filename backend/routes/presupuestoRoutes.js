const express = require("express");

const presupuestoController = require("../controllers/presupuestoController");
const presupuestoDuplicarController = require("../controllers/presupuestoDuplicarController");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/nuevo", auth, presupuestoController.nuevoNumero);
router.post("/", auth, presupuestoController.crear);
router.get("/", auth, presupuestoController.listar);
router.get("/:id", auth, presupuestoController.obtener);
router.post("/:id/duplicar", auth, presupuestoDuplicarController.duplicar);
router.get("/:id/pdf", auth, presupuestoController.pdf);

router.patch("/:id/estado", auth, presupuestoController.cambiarEstado);
router.put("/:id", auth, presupuestoController.actualizar);
router.delete("/:id", auth, presupuestoController.eliminar);

module.exports = router;
