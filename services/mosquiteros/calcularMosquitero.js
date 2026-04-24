const { fromRoot } = require("../../utils/path");

// 📦 DATA
const colores = require(fromRoot("frontend/data/colores.json"));
const mosquiteros = require(
  fromRoot("frontend/data/productos/mosquiteros.json"),
);
const perfiles = require(fromRoot("config/perfiles"));

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
  const {
    medida,
    color,
    perfil = "amarilla", // default
  } = dataInput;

  const datos = mosquiteros.medidas?.[medida];

  if (!datos) {
    throw new Error(`Medida no encontrada: ${medida}`);
  }

  const base = datos.precio || datos.base || 0;

  // 🎨 COLOR
  const colorValor = getColorValor(color);
  let total = base * (1 + colorValor);

  // 📊 PERFIL (mosquiteros ventana)
  const perfilData =
    perfiles[perfil]?.mosquiteros_ventana ||
    perfiles["amarilla"].mosquiteros_ventana;

  const AUMENTO1 = perfilData.aumento_proveedor_1;
  const AUMENTO2 = perfilData.aumento_proveedor_2;
  const GANANCIA = perfilData.ganancia;

  // 💰 CÁLCULO
  total *= 1 + AUMENTO1;
  total *= 1 + AUMENTO2;
  total *= 1 + GANANCIA;

  return {
    total: Math.round(total),
  };
}

module.exports = calcularMosquitero;
