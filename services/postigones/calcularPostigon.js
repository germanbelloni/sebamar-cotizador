const { fromRoot } = require("../../utils/path");

const colores = require(fromRoot("frontend/data/colores.json"));
const perfiles = require(fromRoot("config/perfiles.js"));
const data = require(fromRoot("frontend/data/productos/postigones.json"));

function getColorValor(color) {
  const c = colores.find(
    (x) => x.nombre.toLowerCase().trim() === (color || "").toLowerCase().trim(),
  );
  return c ? c.valor : 0;
}

function calcularPostigon(dataInput) {
  const {
    medida,
    tipo,
    marco,
    color,
    perfil = "amarilla",
    linea = "herrero",
  } = dataInput;

  const datos = data.medidas?.[medida];

  if (!datos) {
    throw new Error("Medida no encontrada");
  }

  // 🔹 PERFIL DINÁMICO (igual que rajas/ventanas)
  const perfilData = perfiles[perfil]?.[linea] || perfiles["amarilla"][linea];

  let base = 0;

  // 🔹 TIPO
  if (tipo === "corredizo") {
    base = datos.corredizo || 0;
  }

  if (tipo === "abrir") {
    base = datos.de_abrir || 0;

    // 🔹 5% extra (confirmar con Excel si es siempre así)
    if (marco === "ancho") {
      base *= 1.05;
    }
  }

  // 🎨 COLOR
  const colorValor = getColorValor(color);
  base *= 1 + colorValor;

  // 📉 REGLAS DESDE PERFIL (NO HARDCODE)
  base *= 1 - perfilData.descuento;
  base *= 1 + perfilData.flete;
  base *= 1 + perfilData.ganancia;

  return {
    total: Math.round(base),
    hojas: datos.hojas,
  };
}

module.exports = calcularPostigon;
