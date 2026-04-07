const fs = require("fs");
const path = require("path");

module.exports = function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Método no permitido" });
    }

    const filePath = path.join(
      process.cwd(),
      "data/productos/puertas_herrero.json"
    );

    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    const { modelo, tipoVidrio, color, tamano, adicionales = [] } = req.body;

    const producto = data.modelos[modelo.toLowerCase()];

    if (!producto) {
      return res.status(400).json({
        error: "Modelo no encontrado",
        modelo,
      });
    }

    let total = producto.base;

    if (!producto.sinVidrio && tipoVidrio) {
      total += producto.vidrios[tipoVidrio] || 0;
    }

    total = total * (1 + (color || 0));

    const ajuste = data.ajustes[tamano] || 0;
    total = total * (1 + ajuste);

    adicionales.forEach((a) => {
      total += data.adicionales[a] || 0;
    });

    total = Math.round(total);

    return res.status(200).json({ total });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error: "Error en cálculo",
      detalle: error.message,
    });
  }
};