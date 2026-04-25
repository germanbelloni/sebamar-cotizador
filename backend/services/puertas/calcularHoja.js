const { fromRoot } = require("../../utils/path");

const colores = require(fromRoot("frontend/data/colores.json"));
const perfiles = require(fromRoot("config/perfiles"));

function getColorValor(color) {
  const c = colores.find(
    (x) => x.nombre.toLowerCase().trim() === (color || "").toLowerCase().trim(),
  );
  return c ? c.valor : 0;
}

function calcularHoja({ producto, linea, dataInput, perfil }) {
  let total = producto.base || 0;

  // 🎨 COLOR
  const colorValor = getColorValor(dataInput.color);
  total = total * (1 + colorValor);

  // 🪟 VIDRIO (POR HOJA)
  if (linea === "herrero") {
    if (!producto.sinVidrio && dataInput.tipoVidrio) {
      total += producto.vidrios[dataInput.tipoVidrio] || 0;
    }
  }

  if (linea === "modena") {
    if (dataInput.vidrio === "dvh") {
      total += (producto.vidrios["4mm"] || 0) * 2;
      total += producto.dvh?.camara || 0;
    } else {
      total += producto.vidrios[dataInput.vidrio] || 0;
    }
  }

  if (linea === "eco") {
    total += producto.vidrios[dataInput.vidrio] || 0;
  }

  // 📏 AJUSTE POR ANCHO
  if (linea === "herrero") {
    const ajuste = dataInput.ajuste || 0;
    total = total * (1 + ajuste);
  }

  // ➕ ADICIONALES
  const adicionales = dataInput.adicionales || [];

  adicionales.forEach((a) => {
    const key = a.toLowerCase().replace(/\s+/g, "_");
    total += producto.adicionales?.[key] || 0;
  });

  // 💰 PERFILES
  let perfilData;

  if (linea === "modena") {
    perfilData = perfiles[perfil]?.modena || perfiles["amarilla"].modena;
  } else {
    perfilData = perfiles[perfil]?.herrero || perfiles["amarilla"].herrero;
  }

  total *= 1 - perfilData.descuento;
  total *= 1 + perfilData.flete;
  total *= 1 + perfilData.ganancia;

  return Math.round(total);
}

module.exports = calcularHoja;
