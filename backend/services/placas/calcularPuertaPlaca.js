const { fromRoot } = require("../../utils/path");

// 📦 DATA
const data = require(fromRoot("frontend/data/productos/puertas_placa.json"));

function calcularPuertaPlaca(dataInput) {
  const {
    tipo, // placa | embutir
    modelo,
    medida,
    marco,
  } = dataInput;

  const modeloData = data?.[tipo]?.[modelo];

  if (!modeloData) {
    throw new Error("Modelo no encontrado");
  }

  const medidaData = modeloData?.[medida];

  if (!medidaData) {
    throw new Error("Medida no encontrada");
  }

  const precioBase = medidaData?.[marco];

  if (!precioBase) {
    throw new Error("Configuración inválida (marco)");
  }

  // 🔹 SOLO BASE (SIN PERFIL)
  return {
    base: precioBase,
  };
}

module.exports = calcularPuertaPlaca;
