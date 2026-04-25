const { fromRoot } = require("../../utils/path");

const colores = require(fromRoot("frontend/data/colores.json"));
const perfiles = require(fromRoot("config/perfiles"));

// 🎨 COLOR
function getColorValor(color) {
  const c = colores.find(
    (x) => x.nombre.toLowerCase().trim() === (color || "").toLowerCase().trim(),
  );
  return c ? c.valor : 0;
}

// =======================
// 🧠 MAIN
// =======================
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

// =======================
// 🟡 HERRERO
// =======================
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
    fromRoot("frontend/data/productos/ventanas_herrero.json"),
  );

  const datos = data.medidas?.[medida];
  if (!datos) throw new Error(`Medida no encontrada: ${medida}`);

  const base = datos.base || 0;
  const guia = datos.guia || 0;
  const mosq = datos.mosquitero || 0;
  const vidrio = datos.vidrio || 0;

  const colorValor = getColorValor(color);

  // 🔹 BASE + VIDRIO
  const baseColor = (base + vidrio) * (1 + colorValor);

  // 🔹 GUIA
  const guiaColor = incluirGuia ? guia * (1 + colorValor) : 0;

  // 🔹 MOSQUITER0 (CON COLOR)
  const mosqColor = incluirMosquitero ? mosq * (1 + colorValor) : 0;

  function aplicarCostos(valor) {
    valor *= 1 - perfilData.descuento;
    valor *= 1 + perfilData.flete;
    valor *= 1 + perfilData.ganancia;
    return valor;
  }

  const baseFinal = aplicarCostos(baseColor);
  const guiaFinal = incluirGuia ? aplicarCostos(guiaColor) : 0;

  // 🧵 MOSQUITER0 (ganancia especial)
  let mosqFinal = 0;

  if (incluirMosquitero) {
    mosqFinal = mosqColor;

    mosqFinal *= 1 - perfilData.descuento;
    mosqFinal *= 1 + perfilData.flete;

    // ganancia especial
    mosqFinal *= 1 + 0.6;
  }

  return {
    total: Math.round(baseFinal + guiaFinal + mosqFinal),
  };
}

// =======================
// 🔵 MODENA
// =======================
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
    fromRoot("frontend/data/productos/ventanas_modena.json"),
  );

  const datos = data.medidas?.[medida];
  if (!datos) throw new Error(`Medida no encontrada: ${medida}`);

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

  baseCalc *= 1 - perfilData.descuento;
  baseCalc *= 1 + perfilData.flete;
  baseCalc *= 1 + perfilData.ganancia;

  // 🔹 GUIA
  let guiaCalc = 0;
  if (incluirGuia) {
    guiaCalc = guia; // sin color ni perfil (como ya definiste)
  }

  // 🔹 MOSQUITER0
  let mosqCalc = 0;
  if (incluirMosquitero) {
    mosqCalc = mosq * (1 + 0.6);
  }

  return {
    total: Math.round(baseCalc + guiaCalc + mosqCalc),
  };
}

module.exports = calcularVentana;
