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

    if (!modelo) {
      return res.status(400).json({ error: "Falta modelo" });
    }

    const producto = data.modelos[modelo.toLowerCase()];

    if (!producto) {
      return res.status(400).json({
        error: "Modelo no encontrado",
        modeloRecibido: modelo,
        modelosDisponibles: Object.keys(data.modelos)
      });
    }

    let total = producto.base;

    if (!producto.sinVidrio && tipoVidrio) {
      total += producto.vidrios[tipoVidrio] || 0;
    }

    total = total * (1 + color);

    const ajuste = data.ajustes[tamano] || 0;
    total = total * (1 + ajuste);

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