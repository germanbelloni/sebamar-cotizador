const { fromRoot } = require("../../utils/path");

const perfiles = require(fromRoot("config/perfiles"));
const data = require(fromRoot("frontend/data/productos/superficies.json"));

module.exports = function calcularContramarco({
  ancho,
  alto,
  color = "blanco",
  perfil = "amarilla",
  linea = "herrero",
}) {
  if (!ancho || !alto) {
    throw new Error("Faltan dimensiones");
  }

  const base = data.superficies.contramarco;

  const perimetro = ancho * 2 + alto * 2;

  let total = perimetro * base;

  const recargo = data.recargos[color] || 1;

  total *= recargo;

  // 🔹 PERFIL CORRECTO
  const perfilData = perfiles[perfil]?.[linea];

  if (!perfilData) {
    throw new Error(`Perfil inválido: ${perfil} - ${linea}`);
  }

  total *= 1 - (perfilData.descuento || 0);
  total *= 1 + (perfilData.flete || 0);
  total *= 1 + (perfilData.ganancia || 0);

  return { total };
};
