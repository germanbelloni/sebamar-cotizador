const fs = require("fs");
const { fromRoot } = require("../../utils/path");

const colores = require(fromRoot("frontend/data/colores.json"));
const perfiles = require(fromRoot("config/perfiles"));

// 🎨 COLOR
function getColorValor(color) {
  const c = colores.find(
    (x) => x.nombre.toLowerCase().trim() === (color || "").toLowerCase().trim(),
  );
  return c ? c.valor : 0;
}

function calcularRaja(dataInput) {
  const {
    medida,
    tipoVidrio,
    color,
    perfil = "amarilla",
    linea = "herrero",
    extraVidrio = 0,
  } = dataInput;

  // 📊 PERFIL
  const perfilData = perfiles[perfil]?.[linea] || perfiles["amarilla"][linea];

  // 📦 DATA
  const filePath = fromRoot(`frontend/data/productos/rajas_${linea}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  let datos = null;

  // 🔍 BUSCAR MEDIDA EN TODOS LOS TIPOS
  if (data.tipos) {
    for (const tipo in data.tipos) {
      const medidas = data.tipos[tipo].medidas;

      if (medidas?.[medida]) {
        datos = medidas[medida];
        break;
      }
    }
  }

  // 🔁 FALLBACK (por si algún JSON viene plano)
  if (!datos && data.medidas) {
    datos = data.medidas[medida];
  }

  if (!datos) {
    throw new Error(`Medida no encontrada: ${medida}`);
  }

  // =========================
  // 💰 CÁLCULO
  // =========================

  const base = datos.base || 0;
  let vidrio = datos.vidrios?.[tipoVidrio] || 0;

  // ➕ extras de vidrio (DVH, etc)
  vidrio += extraVidrio;

  // 🎨 COLOR
  const colorValor = getColorValor(color);
  const baseColor = base * (1 + colorValor);

  let total = baseColor + vidrio;

  // =========================
  // 📊 PERFIL (negocio)
  // =========================

  total *= 1 - perfilData.descuento;
  total *= 1 + perfilData.flete;
  total *= 1 + perfilData.ganancia;

  return {
    total: Math.round(total),
  };
}

module.exports = calcularRaja;
