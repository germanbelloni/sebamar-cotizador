const { fromRoot } = require("../../utils/path");

const colores = require(fromRoot("frontend/data/colores.json"));
const data = require(fromRoot("frontend/data/productos/postigones.json"));

// 🎨 COLOR
function getColorValor(color) {
  const c = colores.find(
    (x) => x.nombre.toLowerCase().trim() === (color || "").toLowerCase().trim(),
  );
  return c ? c.valor : 0;
}

function calcularPostigon(dataInput) {
  const { medida, tipo, marco, color } = dataInput;

  const datos = data.medidas?.[medida];

  if (!datos) {
    throw new Error("Medida no encontrada");
  }

  let base = 0;

  if (tipo === "corredizo") {
    base = datos.corredizo || 0;
  } else if (tipo === "abrir") {
    base = datos.de_abrir || 0;
  } else {
    throw new Error("Tipo inválido");
  }

  // 🎨 COLOR
  const colorValor = getColorValor(color);
  base *= 1 + colorValor;

  return {
    total: Math.round(base),
    hojasBase: datos.hojas || 2,
  };
}

module.exports = calcularPostigon;
