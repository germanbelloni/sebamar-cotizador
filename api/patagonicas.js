const calcularPatagonicaModena = require("../services/patagonicas/calcularPatagonicaModena");
const calcularPatagonicaHerrero = require("../services/patagonicas/calcularPatagonicaHerrero");

module.exports = function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Método no permitido" });
    }

    const { linea } = req.body;

    if (!linea) {
      return res.status(400).json({ error: "Falta linea" });
    }

    let resultado;

    if (linea === "herrero") {
      resultado = calcularPatagonicaHerrero(req.body);
    }

    if (linea === "modena") {
      resultado = calcularPatagonicaModena(req.body);
    }

    // 🔜 después agregamos herrero acá

    return res.status(200).json(resultado);
  } catch (error) {
    console.log("ERROR PATAGONICAS:", error.message);

    return res.status(500).json({
      error: "Error en cálculo",
      detalle: error.message,
    });
  }
};
