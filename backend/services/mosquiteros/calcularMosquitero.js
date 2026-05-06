const { fromRoot } = require("../../utils/path");

const colores = require(fromRoot("frontend/data/colores.json"));
const mosquiteros = require(
  fromRoot("frontend/data/productos/mosquiteros.json"),
);

function normalizar(txt) {
  return txt?.toString().toLowerCase().trim();
}

function getColorValor(color) {
  const c = colores.find((x) => normalizar(x.nombre) === normalizar(color));
  return c ? c.valor : 0;
}

function calcularMosquitero(dataInput) {
  const { medida, color } = dataInput;

  const datos = mosquiteros.medidas?.[medida];

  if (!datos) {
    throw new Error(`Medida no encontrada: ${medida}`);
  }

  const base = datos.base || datos.precio || 0;

  const colorValor = getColorValor(color);

  const costoBase = base * (1 + colorValor);

  return {
    costoBase,
  };
}

module.exports = calcularMosquitero;
