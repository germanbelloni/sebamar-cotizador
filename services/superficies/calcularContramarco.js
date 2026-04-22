const { fromRoot } = require("../../utils/path");

const superficies = require(
  fromRoot("frontend/data/productos/superficies.json"),
);
const perfiles = require(fromRoot("config/perfiles"));

function calcularContramarco(input) {
  const { ancho, alto, color = "blanco", perfil = "amarilla" } = input;

  if (!ancho || !alto) {
    throw new Error("Faltan dimensiones");
  }

  const base = superficies?.superficies?.contramarco;
  if (!base) {
    throw new Error("Base de contramarco no encontrada");
  }

  const recargos = superficies.recargos || {};
  const perfilData =
    perfiles[perfil]?.superficie || perfiles["amarilla"].superficie;

  // 🔹 PERÍMETRO
  const perimetro = ancho * 2 + alto * 2;

  let total = perimetro * base;

  // 🔹 COLOR
  if (color.toLowerCase() !== "blanco") {
    const multColor = recargos[color.toLowerCase()];
    if (!multColor) {
      throw new Error("Color no válido");
    }
    total *= multColor;
  }

  // 🔹 PERFIL COMERCIAL
  total *= 1 - (perfilData.descuento || 0);
  total *= 1 + (perfilData.flete || 0);
  total *= 1 + (perfilData.ganancia || 0);

  return {
    total: Math.round(total),
  };
}

module.exports = calcularContramarco;
