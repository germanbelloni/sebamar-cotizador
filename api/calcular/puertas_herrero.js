import data from "../../data/productos/puertas_herrero.json";

export default function handler(req, res) {

  try {

    const {
      modelo,
      tipoVidrio,
      color,
      tamano,
      adicionales
    } = req.body;

    const producto = data.modelos[modelo.toLowerCase()];

    if (!producto) {
      return res.status(400).json({ error: "Modelo no encontrado" });
    }

    // BASE
    let total = producto.base;

    // VIDRIO
    if (!producto.sinVidrio && tipoVidrio) {
      total += producto.vidrios[tipoVidrio] || 0;
    }

    // COLOR (multiplicador)
    total = total * (1 + color);

    // TAMAÑO
    const ajuste = data.ajustes[tamano] || 0;
    total = total * (1 + ajuste);

    // ADICIONALES
    if (adicionales && adicionales.length) {
      adicionales.forEach(a => {
        total += data.adicionales[a] || 0;
      });
    }

    return res.status(200).json({
      total: Math.round(total)
    });

  } catch (error) {
    return res.status(500).json({
      error: "Error en cálculo",
      detalle: error.message
    });
  }

}