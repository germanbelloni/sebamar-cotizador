const fs = require("fs");
const path = require("path");
const colores = require("../../data/colores.json");
const perfiles = require("../../config/perfiles");

function getColorValor(color) {
  const c = colores.find(
    (x) => x.nombre.toLowerCase().trim() === (color || "").toLowerCase().trim(),
  );
  return c ? c.valor : 0;
}

function calcularVentana(dataInput) {
  const {
    medida,
    color,
    incluirGuia,
    incluirMosquitero,
    perfil = "amarilla",
  } = dataInput;

  const perfilData = perfiles[perfil]?.herrero || perfiles["amarilla"].herrero;

  const filePath = path.join(
    process.cwd(),
    "data/productos/ventanas_herrero.json",
  );

  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  const datos = data.medidas?.[medida];

  if (!datos) {
    throw new Error("Medida no encontrada");
  }

  const base = datos.base || 0;
  const guia = datos.guia || 0;
  const mosq = datos.mosquitero || 0;
  const vidrio = datos.vidrio || 0;

  const colorValor = getColorValor(color);

  const baseColor = base * (1 + colorValor);
  const guiaColor = incluirGuia ? guia * (1 + colorValor) : 0;
  const mosqColor = incluirMosquitero ? mosq * (1 + colorValor) : 0;

  let total = baseColor + vidrio + guiaColor + mosqColor;

  total *= 1 - perfilData.descuento;
  total *= 1 + perfilData.flete;
  total *= 1 + perfilData.ganancia;

  return {
    total: Math.round(total),
  };
}

module.exports = calcularVentana;
