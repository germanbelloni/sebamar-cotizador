const fs = require("fs");
const path = require("path");
const colores = require("../../data/colores.json");

function getColorValor(color) {
  const c = colores.find(
    (x) => x.nombre.toLowerCase().trim() === (color || "").toLowerCase().trim(),
  );
  return c ? c.valor : 0;
}

function calcularRaja(dataInput) {
  const { linea, tipoVidrio, color, medida } = dataInput;

  let filePath;

  if (linea === "herrero") {
    filePath = "data/productos/rajas_herrero.json";
  }

  if (linea === "modena") {
    filePath = "data/productos/rajas_modena.json";
  }

  const data = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), filePath), "utf-8"),
  );

  const datos = data.medidas?.[medida];

  if (!datos) throw new Error("Medida no encontrada");

  const base = datos.base || 0;

  // 🎨 COLOR
  const colorValor = getColorValor(color);
  const baseColor = base * (1 + colorValor);

  // 🪟 VIDRIO
  let vidrio = 0;

  if (linea === "modena" && tipoVidrio === "dvh") {
    const vidrio4 = datos.vidrios["4mm"] || 0;
    const camara = datos.camara || 0;

    vidrio = vidrio4 * 2 + camara;
  } else {
    vidrio = datos.vidrios?.[tipoVidrio] || 0;
  }

  // 💰 SUBTOTAL
  let total = baseColor + vidrio;

  // 📉 REGLAS
  const descuento = linea === "modena" ? 0.07 : 0.1;
  const flete = 0.06;
  const ganancia = 0.3;

  total *= 1 - descuento;
  total *= 1 + flete;
  total *= 1 + ganancia;

  return {
    total: Math.round(total),
  };
}

module.exports = calcularRaja;
