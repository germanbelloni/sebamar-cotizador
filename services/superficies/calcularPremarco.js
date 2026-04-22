const { fromRoot } = require("../../utils/path");

const superficies = require(
  fromRoot("frontend/data/productos/superficies.json"),
);
const perfiles = require(fromRoot("config/perfiles"));

function calcularPremarco(input) {
  const { ancho, alto, perfil = "amarilla" } = input;

  if (!ancho || !alto) {
    throw new Error("Faltan dimensiones");
  }

  const base = superficies?.superficies?.premarco;
  if (!base) {
    throw new Error("Base de premarco no encontrada");
  }

  const perfilData =
    perfiles[perfil]?.superficie || perfiles["amarilla"].superficie;

  // 🔹 PERÍMETRO
  const perimetro = ancho * 2 + alto * 2;

  let total = perimetro * base;

  // 🔹 PERFIL COMERCIAL
  total *= 1 - (perfilData.descuento || 0);
  total *= 1 + (perfilData.flete || 0);
  total *= 1 + (perfilData.ganancia || 0);

  return {
    total: Math.round(total),
  };
}

module.exports = calcularPremarco;
