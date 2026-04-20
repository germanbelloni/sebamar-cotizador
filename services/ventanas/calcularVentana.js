const fs = require("fs");
const path = require("path");

const colores = require(path.join(process.cwd(), "frontend/data/colores.json"));
const perfiles = require("../../config/perfiles");

function getColorValor(color) {
  const c = colores.find(
    (x) => x.nombre.toLowerCase().trim() === (color || "").toLowerCase().trim(),
  );
  return c ? c.valor : 0;
}

function calcularVentana(dataInput) {
  const { linea = "herrero" } = dataInput;

  if (!linea) {
    throw new Error("Falta 'linea' (herrero/modena)");
  }

  if (linea === "modena") {
    return calcularVentanaModena(dataInput);
  }

  return calcularVentanaHerrero(dataInput);
}

//
// =======================
// 🟡 HERRERO
// =======================
//
function calcularVentanaHerrero(dataInput) {
  const {
    medida,
    color,
    incluirGuia,
    incluirMosquitero,
    perfil = "amarilla",
  } = dataInput;

  const perfilData = perfiles[perfil]?.herrero || perfiles["amarilla"].herrero;

  const data = require(
    path.join(process.cwd(), "frontend/data/productos/ventanas_herrero.json"),
  );

  const datos = data.medidas?.[medida];
  if (!datos) throw new Error("Medida no encontrada");

  const base = datos.base || 0;
  const guia = datos.guia || 0;
  const mosq = datos.mosquitero || 0;
  const vidrio = datos.vidrio || 0;

  const colorValor = getColorValor(color);

  // 🔹 BASE
  const baseColor = (base + vidrio) * (1 + colorValor);

  // 🔹 GUIA
  const guiaColor = incluirGuia ? guia * (1 + colorValor) : 0;

  // 🔹 MOSQ (CON COLOR)
  const mosqColor = incluirMosquitero ? mosq * (1 + colorValor) : 0;

  function aplicarCostos(valor) {
    valor *= 1 - perfilData.descuento;
    valor *= 1 + perfilData.flete;
    valor *= 1 + perfilData.ganancia;
    return valor;
  }

  const baseFinal = aplicarCostos(baseColor);
  const guiaFinal = incluirGuia ? aplicarCostos(guiaColor) : 0;

  // 👇 MOSQ SOLO GANANCIA
  let mosqFinal = 0;

  if (incluirMosquitero) {
    mosqFinal = mosqColor;

    mosqFinal *= 1 - perfilData.descuento;
    mosqFinal *= 1 + perfilData.flete;

    // 👇 ganancia especial
    mosqFinal *= 1 + 0.6;
  }

  return {
    total: Math.round(baseFinal + guiaFinal + mosqFinal),
  };
}

//
// =======================
// 🔵 MODENA
// =======================
//
function calcularVentanaModena(dataInput) {
  const {
    medida,
    color,
    incluirGuia,
    incluirMosquitero,
    tipoVidrio,
    perfil = "amarilla",
  } = dataInput;

  if (!tipoVidrio) {
    throw new Error("Falta 'tipoVidrio' para modena");
  }

  const perfilData = perfiles[perfil]?.modena || perfiles["amarilla"].modena;

  const data = require(
    path.join(process.cwd(), "frontend/data/productos/ventanas_modena.json"),
  );

  const datos = data.medidas?.[medida];
  if (!datos) throw new Error("Medida no encontrada");

  const base = datos.base || 0;
  const guia = datos.guia || 0;
  const mosq = datos.mosquitero || 0;

  const colorValor = getColorValor(color);

  // 🔹 VIDRIO
  let vidrio = 0;

  if (tipoVidrio === "dvh") {
    const v4 = datos.vidrios?.["4mm"] || 0;
    const cam = datos.vidrios?.["dvh"] || 0;
    vidrio = v4 * 2 + cam;
  } else {
    vidrio = datos.vidrios?.[tipoVidrio] || 0;
  }

  // 🔹 BASE + VIDRIO
  let baseCalc = (base + vidrio) * (1 + colorValor);

  // 🔹 COSTOS BASE
  baseCalc *= 1 - perfilData.descuento;
  baseCalc *= 1 + perfilData.flete;
  baseCalc *= 1 + perfilData.ganancia;

  // 🔹 GUIA (⚠️ DISTINTO A HERRERO)
  let guiaCalc = 0;
  if (incluirGuia) {
    guiaCalc = incluirGuia ? guia : 0;
  }

  // 🔹 MOSQ
  let mosqCalc = 0;
  if (incluirMosquitero) {
    mosqCalc = incluirMosquitero ? mosq * (1 + 0.6) : 0;
  }

  return {
    total: Math.round(baseCalc + guiaCalc + mosqCalc),
  };
}

module.exports = calcularVentana;
