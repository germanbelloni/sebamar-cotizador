const { fromRoot } = require("../../utils/path");

const perfiles = require(fromRoot("config/perfiles"));
const data = require(fromRoot("frontend/data/productos/superficies.json"));

module.exports = function calcularPanoFijo({
  ancho,
  alto,
  linea,
  color = "blanco",
  tipoVidrio,
  perfil = "amarilla",
}) {
  if (!ancho || !alto || !linea || !tipoVidrio) {
    throw new Error("Faltan datos para calcular paño fijo");
  }

  const base = data.superficies.pano_fijo[linea];

  if (!base) {
    throw new Error(`Linea inválida: ${linea}`);
  }

  // 🔹 PERÍMETRO
  const perimetro = ancho * 2 + alto * 2;

  let totalPerfil = perimetro * base;

  // 🔹 COLOR
  if (color !== "blanco") {
    const recargo = data.recargos[color];
    if (!recargo) {
      throw new Error(`Color inválido: ${color}`);
    }
    totalPerfil *= recargo;
  }

  // 🔹 VIDRIO
  const vidrioPrecio = data.vidrios[tipoVidrio];

  if (!vidrioPrecio) {
    throw new Error(`Vidrio inválido: ${tipoVidrio}`);
  }

  const m2 = (ancho * alto) / 10000;
  const totalVidrio = m2 * vidrioPrecio;

  let total = totalPerfil + totalVidrio;

  // 🔹 PERFIL COMERCIAL
  const perfilData = perfiles[perfil]?.[linea];

  if (!perfilData) {
    throw new Error(`Perfil inválido: ${perfil} - ${linea}`);
  }

  total *= 1 - (perfilData.descuento || 0);
  total *= 1 + (perfilData.flete || 0);
  total *= 1 + (perfilData.ganancia || 0);

  return { total };
};
