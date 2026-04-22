const { fromRoot } = require("../../utils/path");

const superficies = require(
  fromRoot("frontend/data/productos/superficies.json"),
);
const perfiles = require(fromRoot("config/perfiles"));

function calcularPanoFijo(input) {
  const {
    ancho,
    alto,
    linea,
    color = "blanco",
    tipoVidrio,
    perfil = "amarilla",
  } = input;

  // 🧠 VALIDACIONES
  if (!ancho || !alto) {
    throw new Error("Faltan dimensiones");
  }

  if (!linea) {
    throw new Error("Falta linea (herrero/modena)");
  }

  // 📦 DATOS
  const basePerfil = superficies?.superficies?.pano_fijo?.[linea];
  if (!basePerfil) {
    throw new Error("Base de paño fijo no encontrada");
  }

  const valorVidrio = superficies?.vidrios?.[tipoVidrio];
  if (!valorVidrio) {
    throw new Error("Vidrio no encontrado");
  }

  const recargos = superficies.recargos || {};
  const perfilData =
    perfiles[perfil]?.superficie || perfiles["amarilla"].superficie;

  // 🧮 PERÍMETRO
  const perimetro = ancho * 2 + alto * 2;

  let totalPerfil = perimetro * basePerfil;

  // 🎨 COLOR
  if (color !== "blanco") {
    const multColor = recargos[color];
    if (!multColor) {
      throw new Error("Color no válido");
    }
    totalPerfil *= multColor;
  }

  // 🪟 VIDRIO
  const m2 = (ancho * alto) / 10000;
  const totalVidrio = m2 * valorVidrio;

  // 💰 TOTAL BASE
  let total = totalPerfil + totalVidrio;

  // 📊 PERFIL COMERCIAL
  total *= 1 - perfilData.descuento;
  total += perfilData.flete;
  total *= 1 + perfilData.ganancia;

  return {
    total: Math.round(total),
  };
}

module.exports = calcularPanoFijo;
