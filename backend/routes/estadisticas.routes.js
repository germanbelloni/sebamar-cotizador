const express = require("express");

const auth = require("../middleware/auth");
const estadisticasController = require("../controllers/estadisticasController");
const router = express.Router();

router.get("/", auth, estadisticasController.listar);

router.post("/uso", auth, estadisticasController.registrar);

module.exports = router;
