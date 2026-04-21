const { fromRoot } = require("../../utils/path");

// 📦 DATA (cacheada)
const colores = require(fromRoot("frontend/data/colores.json"));
const mosquiteros = require(
  fromRoot("frontend/data/productos/mosquiteros.json"),
);

// 🔧 HELPERS
function normalizar(txt) {
  return txt?.toString().toLowerCase().trim();
}

function getColorValor(color) {
  const c = colores.find((x) => normalizar(x.nombre) === normalizar(color));

  return c ? c.valor : 0;
}

// 🧠 SERVICE
function calcularMosquitero(dataInput) {
  const { medida, color } = dataInput;

  const datos = mosquiteros.medidas?.[medida];

  if (!datos) {
    throw new Error(`Medida no encontrada: ${medida}`);
  }

  // 🔥 OJO: depende de cómo definiste el JSON
  const base = datos.precio || datos.base || 0;

  // 🎨 COLOR
  const colorValor = getColorValor(color);
  let total = base * (1 + colorValor);

  // 💰 FACTORES (explicados)
  const DESCUENTO = 0.08;
  const FLETE = 0.15;
  const GANANCIA = 0.6;

  total *= 1 - DESCUENTO;
  total *= 1 + FLETE;
  total *= 1 + GANANCIA;

  return {
    total: Math.round(total),
  };
}

module.exports = calcularMosquitero;
