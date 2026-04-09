const fs = require("fs");
const path = require("path");

module.exports = function handler(req, res) {
  try {
    console.log("🔥 USANDO PUERTAS HERRERO");

    if (req.method !== "POST") {
      return res.status(405).json({ error: "Método no permitido" });
    }

    const filePath = path.join(
      process.cwd(),
      "data/productos/puertas_herrero.json"
    );

    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    const fileMedia = path.join(
      process.cwd(),
      "data/productos/puertas_media_herrero.json"
    );

    const dataMedia = JSON.parse(fs.readFileSync(fileMedia, "utf-8"));

    const {
      modelo,
      tipoVidrio,
      color,
      tamano,
      adicionales = [],
      modeloMedia,
    } = req.body;

    const modeloKey = modelo.toLowerCase().trim();
    const producto = data.modelos[modeloKey];

    console.log("MODELO FRONT:", modelo);
    console.log("MEDIA FRONT:", modeloMedia);

    if (!producto) {
      return res.status(400).json({
        error: "Modelo no encontrado",
        modelo,
      });
    }

    let total = producto.base;

    // 🔥 MEDIA PUERTA (BIEN HECHO)
    if (modeloMedia) {
      const mediaKey = modeloMedia.toLowerCase().trim();
      const media = dataMedia.medias[mediaKey];

      console.log("MEDIA:", mediaKey, media);

      if (media) {
        total += media.base || 0;

        if (tipoVidrio && media.vidrios && media.vidrios[tipoVidrio]) {
          total += media.vidrios[tipoVidrio];
        }
      } else {
        console.log("❌ MEDIA NO ENCONTRADA");
      }
    }

    // VIDRIO
    if (!producto.sinVidrio && tipoVidrio) {
      total += producto.vidrios[tipoVidrio] || 0;
    }

    // COLOR
    total = total * (1 + (color || 0));

    // TAMAÑO
    const ajuste = data.ajustes[tamano] || 0;
    total = total * (1 + ajuste);

    // ADICIONALES
    const adicionalesDetalle = {};

    (adicionales || []).forEach((a) => {
      const key = a.toLowerCase().replace(/\s+/g, "_");
      const valor = data.adicionales[key] || 0;

      adicionalesDetalle[key] = valor;
      total += valor;
    });

    total = Math.round(total);

    return res.status(200).json({
      total,
      adicionalesDetalle,
    });

  } catch (error) {
    console.log("❌ ERROR BACK:", error);
    console.log("BODY:", req.body);

    return res.status(500).json({
      error: "Error en cálculo",
      detalle: error.message,
    });
  }
};