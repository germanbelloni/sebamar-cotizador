const fs = require("fs");
const path = require("path");
const { fromRoot } = require("../../utils/path");

const colores = require(fromRoot("frontend/data/colores.json"));
const perfiles = require("../../config/perfiles");

function getColorValor(color) {
  const c = colores.find(
    (x) => x.nombre.toLowerCase().trim() === (color || "").toLowerCase().trim(),
  );
  return c ? c.valor : 0;
}

function normalizarMedida(medida) {
  if (!medida) return null;

  if (medida.includes("x")) {
    const [a, b] = medida.split("x").map(Number);

    if (a > 1000 || b > 1000) {
      return `${a / 10}x${b / 10}`;
    }
  }

  return medida.trim().toLowerCase();
}
function calcularPatagonicaModena(dataInput) {
  const { tipo, medida, color, tipoVidrio, perfil = "amarilla" } = dataInput;

  const perfilData = perfiles[perfil]?.modena || perfiles["amarilla"].modena;

  const filePath = fromRoot("frontend/data/productos/patagonicas_modena.json");

  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  const medidaKey = normalizarMedida(medida);

  const datos = data.tipos?.[tipo]?.medidas?.[medidaKey];

  if (!datos) {
    throw new Error("Medida no encontrada");
  }

  const base = datos.base || 0;

  const colorValor = getColorValor(color);
  const baseColor = base * (1 + colorValor);

  let vidrio = 0;

  if (tipoVidrio === "dvh") {
    const vidrio4 = datos.vidrios["4mm"] || 0;
    const camara = datos.camara || 0;
    vidrio = vidrio4 * 2 + camara;
  } else {
    vidrio = datos.vidrios?.[tipoVidrio] || 0;
  }

  let total = baseColor + vidrio;

  total *= 1 - perfilData.descuento;
  total *= 1 + perfilData.flete;
  total *= 1 + perfilData.ganancia;

  return {
    total: Math.round(total),
  };
}

module.exports = calcularPatagonicaModena;
