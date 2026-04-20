const { fromRoot } = require("../../utils/path");

const calcularHoja = require("./calcularHoja");

function parseMedida(medida) {
  const [ancho, alto] = medida.split("x").map(Number);
  return { ancho, alto };
}

function getCantidadHojas(tipo) {
  if (tipo === "doble") return 2;
  if (tipo === "porton") return 3;
  return 1; // simple
}

function calcularPuerta(dataInput) {
  const {
    tipo = "simple",
    linea,
    modelo,
    medida, // ej: "160x200"
    color,
    tipoVidrio,
    adicionales = [],
    perfil = "amarilla",
  } = dataInput;

  const data = require(
    fromRoot(`frontend/data/productos/puertas_${linea}.json`),
  );

  const { ancho, alto } = parseMedida(medida);

  const cantidadHojas = getCantidadHojas(tipo);

  const anchoHoja = ancho / cantidadHojas;

  const medidaHoja = `${anchoHoja}x${alto}`;

  // 🔧 AJUSTE (70 / 80 / 90)
  const ajuste = data.ajustes?.[medidaHoja] || 0;

  const producto = data.modelos?.[modelo];

  if (!producto) {
    throw new Error("Modelo no encontrado");
  }

  let total = 0;

  for (let i = 0; i < cantidadHojas; i++) {
    const hoja = calcularHoja({
      producto,
      linea,
      dataInput: {
        color,
        tipoVidrio,
        vidrio: tipoVidrio,
        ajuste,
        adicionales,
      },
      perfil,
    });

    total += hoja;
  }

  return {
    total: Math.round(total),
    cantidadHojas,
    medidaHoja,
  };
}

module.exports = calcularPuerta;
