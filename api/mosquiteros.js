const calcularMosquiteroVentana = require("../wrappers/mosquiteros/calcularMosquiteroVentana");

module.exports = function handler(req, res) {
  try {
    // 🔒 solo POST
    if (req.method !== "POST") {
      return res.status(405).json({
        error: "Método no permitido",
      });
    }

    const { ancho, alto, color } = req.body;

    // 📐 validación básica
    if (!ancho || !alto) {
      return res.status(400).json({
        error: "Faltan ancho o alto",
      });
    }

    // 🧠 cálculo (usa wrapper → service)
    const resultado = calcularMosquiteroVentana({
      ancho: Number(ancho),
      alto: Number(alto),
      color,
    });

    return res.status(200).json(resultado);
  } catch (error) {
    console.log("ERROR MOSQUITEROS:", error.message);

    return res.status(500).json({
      error: "Error en cálculo",
      detalle: error.message,
    });
  }
};
