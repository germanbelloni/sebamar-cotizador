const { fromRoot } = require("../../utils/path");

// 📦 DATA
const data = require(fromRoot("backend/data/productos/puertas_placa.json"));

function calcularPuertaPlaca(dataInput) {
  const { tipo, modelo, medida, marco } = dataInput;

  const tipoData = data?.[tipo];
  if (!tipoData) throw new Error("Tipo inválido");

  const modeloData = tipoData?.[modelo];
  if (!modeloData) throw new Error("Modelo no encontrado");

  const medidaData = modeloData?.[medida];
  if (!medidaData) throw new Error("Medida no encontrada");

  let precioBase;

  // GRANERO
  if (typeof medidaData === "number") {
    precioBase = medidaData;
  } else {
    precioBase = medidaData?.[marco];
  }

  if (!precioBase) {
    throw new Error("Configuración inválida");
  }

  return {
    base: precioBase,
  };
}

module.exports = calcularPuertaPlaca;
