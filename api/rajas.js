const calcularRaja = require("../services/rajas/calcularRaja");

module.exports = function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Método no permitido" });
    }

    const { linea } = req.body;

    if (!linea) {
      return res.status(400).json({ error: "Falta linea" });
    }

    const resultado = calcularRaja(req.body);

    return res.status(200).json(resultado);
  } catch (error) {
    console.log("ERROR RAJAS:", error.message);

    return res.status(500).json({
      error: "Error en cálculo",
      detalle: error.message,
    });
  }
};
