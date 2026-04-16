const calcularMosquitero = require("../services/mosquiteros/calcularMosquitero");

module.exports = function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Método no permitido" });
    }

    const { medida } = req.body;

    if (!medida) {
      return res.status(400).json({ error: "Falta medida" });
    }

    const resultado = calcularMosquitero(req.body);

    return res.status(200).json(resultado);
  } catch (error) {
    console.log("ERROR MOSQUITEROS:", error.message);

    return res.status(500).json({
      error: "Error en cálculo",
      detalle: error.message,
    });
  }
};
