const fs = require("fs");
const path = require("path");
const colores = require("../../data/colores.json");
const perfiles = require("../../config/perfiles");

function getColorValor(color) {
  const c = colores.find(
    (x) => x.nombre.toLowerCase().trim() === (color || "").toLowerCase().trim(),
  );
  return c ? c.valor : 0;
}

function calcularRaja(dataInput) {
  const { medida, tipoVidrio, color, perfil = "amarilla" } = dataInput;

  const perfilData = perfiles[perfil]?.herrero || perfiles["amarilla"].herrero;

  const filePath = path.join(
    process.cwd(),
    "data/productos/rajas_herrero.json",
  );

  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  const datos = data.medidas?.[medida];

  if (!datos) {
    throw new Error("Medida no encontrada");
  }

  const base = datos.base || 0;
  const vidrio = datos.vidrios?.[tipoVidrio] || 0;

  const colorValor = getColorValor(color);
  const baseColor = base * (1 + colorValor);

  let total = baseColor + vidrio;

  total *= 1 - perfilData.descuento;
  total *= 1 + perfilData.flete;
  total *= 1 + perfilData.ganancia;

  return {
    total: Math.round(total),
  };
}

module.exports = calcularRaja;
