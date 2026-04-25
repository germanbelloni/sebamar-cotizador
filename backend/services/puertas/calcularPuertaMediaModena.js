const { fromRoot } = require("../../utils/path");

const calcularPuerta = require(fromRoot("services/puertas/calcularPuerta"));

function calcularPuertaModena(dataInput) {
  const { modelo80, modelo70, tipoVidrio, color, perfil } = dataInput;

  if (!modelo80 || !modelo70) {
    throw new Error("Faltan modelos (80 y 70)");
  }

  const puerta80 = calcularPuerta({
    modelo: modelo80,
    tipoVidrio,
    color,
    perfil,
    linea: "modena",
    medida: "120x200", // 🔥 CLAVE
  });

  const puerta70 = calcularPuerta({
    modelo: modelo70,
    tipoVidrio,
    color,
    perfil,
    linea: "modena",
    medida: "120x200", // 🔥 CLAVE
  });

  let totalBase = puerta80.total + puerta70.total;

  return {
    base: totalBase,
  };
}

module.exports = calcularPuertaModena;
