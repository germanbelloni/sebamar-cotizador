const fs = require("fs");
const path = require("path");
const perfiles = require("../../config/perfiles");

function calcularPuertaPlaca(dataInput) {
  const {
    tipo, // placa | embutir
    modelo,
    medida,
    marco,
    perfil = "amarilla",
  } = dataInput;

  const perfilData = perfiles[perfil]?.placa || perfiles["amarilla"].placa;

  const filePath = path.join(
    process.cwd(),
    "data/productos/puertas_placas.json",
  );

  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

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

  let total = precioBase;

  // 🔥 REGLAS PLACA
  total *= 1 - perfilData.descuento;
  total *= 1 + perfilData.ganancia;

  return {
    total: Math.round(total),
  };
}

module.exports = calcularPuertaPlaca;
