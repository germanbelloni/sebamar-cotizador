const fs = require("fs");
const path = require("path");
const colores = require("../../data/colores.json");

function getColorValor(color) {
  const c = colores.find(
    (x) => x.nombre.toLowerCase().trim() === (color || "").toLowerCase().trim(),
  );
  return c ? c.valor : 0;
}

function calcularPatagonicaModena(dataInput) {
  const { tipo, medida, color, tipoVidrio } = dataInput;

  const filePath = path.join(
    process.cwd(),
    "data/productos/patagonicas_modena.json",
  );

  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  const datos = data.tipos?.[tipo]?.medidas?.[medida];

  if (!datos) {
    throw new Error("Medida no encontrada");
  }

  const base = datos.base || 0;

  // 🎨 COLOR
  const colorValor = getColorValor(color);
  const baseColor = base * (1 + colorValor);

  // 🪟 VIDRIO
  let vidrio = 0;

  if (tipoVidrio === "dvh") {
    const vidrio4 = datos.vidrios["4mm"] || 0;
    const camara = datos.camara || 0;

    vidrio = vidrio4 * 2 + camara;
  } else {
    vidrio = datos.vidrios?.[tipoVidrio] || 0;
  }

  // 💰 SUBTOTAL
  let total = baseColor + vidrio;

  // 📉 REGLAS MODENA
  const descuento = 0.07;
  const flete = 0.06;
  const ganancia = 0.3;

  total *= 1 - descuento;
  total *= 1 + flete;
  total *= 1 + ganancia;

  return {
    total: Math.round(total),
  };
}

module.exports = calcularPatagonicaModena;
