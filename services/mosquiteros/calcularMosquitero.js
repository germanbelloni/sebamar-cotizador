const fs = require("fs");
const path = require("path");

const colores = require(
  path.join(process.cwd(), "../frontend/data/colores.json"),
);

function getColorValor(color) {
  const c = colores.find(
    (x) => x.nombre.toLowerCase().trim() === (color || "").toLowerCase().trim(),
  );

  return c ? c.valor : 0;
}

function calcularMosquitero(dataInput) {
  const { medida, color } = dataInput;

  const filePath = path.join(
    process.cwd(),
    "../frontend/data/productos/mosquiteros.json",
  );

  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  const datos = data.medidas?.[medida];

  if (!datos) {
    throw new Error("Medida no encontrada");
  }

  const base = datos.base || 0;

  const colorValor = getColorValor(color);
  const baseColor = base * (1 + colorValor);

  let total = baseColor;

  total *= 1.08;
  total *= 1.15;
  total *= 1.6;

  return {
    total: Math.round(total),
  };
}

module.exports = calcularMosquitero;
