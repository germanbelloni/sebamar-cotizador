const express = require("express");
const router = express.Router();

const calcularPuertaPlaca = require("../services/placas/calcularPuertaPlaca");

// 🔥 CALCULAR PUERTA PLACA / EMBUTIR
router.post("/", (req, res) => {
  try {
    const resultado = calcularPuertaPlaca(req.body);
    res.json(resultado);
  } catch (error) {
    console.error("Error placas:", error.message);
    res.status(400).json({
      error: "Error cálculo placas",
      detalle: error.message,
    });
  }
});

module.exports = router;
