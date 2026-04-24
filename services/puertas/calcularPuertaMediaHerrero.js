const { fromRoot } = require("../../utils/path");

const data = require(
  fromRoot("frontend/data/productos/puertas_media_herrero.json"),
);

function calcularPuertaMediaHerrero(dataInput) {
  const { modelo, tipoVidrio = "4mm" } = dataInput;

  const modeloData = data.medias?.[modelo];

  if (!modeloData) {
    throw new Error("Modelo media no encontrado");
  }

  const base = modeloData.base || 0;
  const vidrio = modeloData.vidrios?.[tipoVidrio] || 0;

  return {
    base: base + vidrio,
  };
}

module.exports = calcularPuertaMediaHerrero;
