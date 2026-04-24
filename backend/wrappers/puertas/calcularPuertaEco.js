const { fromRoot } = require("../../../utils/path");

const data = require(fromRoot("frontend/data/productos/puertas_eco.json"));

const colores = require(fromRoot("frontend/data/colores.json"));
const perfiles = require(fromRoot("config/perfiles"));

// 🔹 helpers
function normalizar(txt) {
  return txt?.toString().toLowerCase().trim();
}

function getColorValor(color) {
  const c = colores.find((x) => normalizar(x.nombre) === normalizar(color));
  return c ? c.valor : 0;
}

// 🔹 MAIN
function calcularPuertaEco(dataInput) {
  const { modelo, tipoVidrio = "3mm", color, perfil = "amarilla" } = dataInput;

  const modeloKey = normalizar(modelo);

  const datos = Object.entries(data.modelos).find(
    ([key]) => normalizar(key) === modeloKey,
  );

  if (!datos) {
    throw new Error("Modelo no encontrado");
  }

  const modeloData = datos[1];

  const base = modeloData.base || 0;
  const vidrio = modeloData.vidrios?.[tipoVidrio] || 0;

  let total = base + vidrio;

  // 🎨 COLOR
  const colorValor = getColorValor(color);
  total *= 1 + colorValor;

  // 📦 PERFIL
  const perfilData = perfiles[perfil]?.herrero || perfiles["amarilla"].herrero;

  total *= 1 - perfilData.descuento;
  total *= 1 + perfilData.flete;
  total *= 1 + perfilData.ganancia;

  return {
    total: Math.round(total),
    modelo: datos[0],
  };
}

module.exports = calcularPuertaEco;
