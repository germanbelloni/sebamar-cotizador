const calcularPostigon = require("../services/postigones/calcularPostigon");

module.exports = function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Método no permitido" });
    }

    const { medida, tipo, marco, color, perfil, linea } = req.body;

    if (!medida || !tipo || !color) {
      return res.status(400).json({
        error: "Faltan datos obligatorios",
      });
    }

    const resultado = calcularPostigon({
      medida,
      tipo,
      marco,
      color,
      perfil,
      linea,
    });

    return res.status(200).json(resultado);
  } catch (error) {
    console.log("ERROR POSTIGONES:", error.message);

    return res.status(500).json({
      error: "Error en cálculo",
      detalle: error.message,
    });
  }
};
