const { fromRoot } = require("../../utils/path");

const colores = require(fromRoot("frontend/data/colores.json"));
const dataHerrero = require(
  fromRoot("frontend/data/productos/ventanas_herrero.json"),
);
const dataModena = require(
  fromRoot("frontend/data/productos/ventanas_modena.json"),
);

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

  if (linea === "modena") return calcularVentanaModena(dataInput);

  return calcularVentanaHerrero(dataInput);
}

// =======================
// 🟡 HERRERO
// =======================
function calcularVentanaHerrero(dataInput) {
  const { medida, color, incluirGuia, incluirMosquitero } = dataInput;

  const datos = dataHerrero.medidas?.[medida];
  if (!datos) throw new Error(`Medida no encontrada: ${medida}`);

  const colorValor = getColorValor(color);

  const costoBase = (datos.base + (datos.vidrio || 0)) * (1 + colorValor);
  const costoGuia = incluirGuia ? datos.guia * (1 + colorValor) : 0;
  const costoMosquitero = incluirMosquitero
    ? datos.mosquitero * (1 + colorValor)
    : 0;

  return {
    linea: "herrero",
    medida,
    costoBase,
    costoGuia,
    costoMosquitero,
    incluyeGuia: !!incluirGuia,
    incluyeMosquitero: !!incluirMosquitero,
  };
}

// =======================
// 🔵 MODENA
// =======================
function calcularVentanaModena(dataInput) {
  const { medida, color, incluirGuia, incluirMosquitero, tipoVidrio } =
    dataInput;

  if (!tipoVidrio) throw new Error("Falta 'tipoVidrio' para modena");

  const datos = dataModena.medidas?.[medida];
  if (!datos) throw new Error(`Medida no encontrada: ${medida}`);

  const colorValor = getColorValor(color);

  let vidrio = 0;

  if (tipoVidrio === "dvh") {
    vidrio = (datos.vidrios?.["4mm"] || 0) * 2 + (datos.vidrios?.["dvh"] || 0);
  } else {
    vidrio = datos.vidrios?.[tipoVidrio] || 0;
  }

  const costoBase = (datos.base + vidrio) * (1 + colorValor);
  const costoGuia = incluirGuia ? datos.guia * (1 + colorValor) : 0;
  const costoMosquitero = incluirMosquitero
    ? datos.mosquitero * (1 + colorValor)
    : 0;

  return {
    linea: "modena",
    medida,
    costoBase,
    costoGuia,
    costoMosquitero,
    incluyeGuia: !!incluirGuia,
    incluyeMosquitero: !!incluirMosquitero,
  };
}

module.exports = calcularVentana;
