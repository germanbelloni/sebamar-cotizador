const fs = require("fs");
const path = require("path");
const colores = require("../data/colores.json");

function getColorValor(color) {
  const c = colores.find(
    (x) => x.nombre.toLowerCase().trim() === (color || "").toLowerCase().trim(),
  );
  return c ? c.valor : 0;
}

module.exports = function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Método no permitido" });
    }

    const filePath = path.join(process.cwd(), "data/productos/postigones.json");

    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    const { medida, tipo, marco, color } = req.body;

    const datos = data.medidas?.[medida];

    if (!datos) {
      return res.status(400).json({ error: "Medida no encontrada" });
    }

    let base = 0;

    // 🔥 TIPO
    if (tipo === "corredizo") {
      base = datos.corredizo || 0;
    }

    if (tipo === "abrir") {
      base = datos.de_abrir || 0;

      // 🔥 MARCO ANCHO
      if (marco === "ancho") {
        base *= 1.05;
      }
    }

    // 🎨 COLOR
    const colorValor = getColorValor(color);
    base = base * (1 + colorValor);

    // 📉 REGLAS (HERRERO)
    const descuento = 0.1;
    const flete = 0.06;
    const ganancia = 0.3;

    base *= 1 - descuento;
    base *= 1 + flete;
    base *= 1 + ganancia;

    base = Math.round(base);

    return res.status(200).json({
      total: base,
      hojas: datos.hojas,
    });
  } catch (error) {
    console.log("ERROR POSTIGONES:", error.message);

    return res.status(500).json({
      error: "Error en cálculo",
      detalle: error.message,
    });
  }
};
