const { fromRoot } = require("../../utils/path");

const colores = require(fromRoot("frontend/data/colores.json"));
const superficies = require(
  fromRoot("frontend/data/productos/superficies.json"),
);

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

// 📏 HELPERS UNIDADES
function toM2(ancho, alto) {
  return (ancho * alto) / 10000;
}

function toML(ancho, alto) {
  return ((ancho + alto) * 2) / 100;
}

// 🪟 VIDRIO MODENA
function calcularVidrioModena(datos, ancho, alto, tipoVidrio) {
  if (!tipoVidrio) return 0;

  // DVH base (lista)
  if (tipoVidrio === "dvh") {
    return (datos.vidrios?.["4mm"] || 0) * 2 + (datos.vidrios?.["dvh"] || 0);
  }

  // DVH 5+9+5
  if (tipoVidrio === "dvh_5_9_5") {
    const m2 = toM2(ancho, alto);
    const perimetro = toML(ancho, alto);

    const vidrio5 = superficies.vidrios["5mm"] || 0;
    const camara = superficies.vidrios["dvh"] || 0;

    return m2 * vidrio5 * 2 + perimetro * camara;
  }

  // Laminado 4+4
  if (tipoVidrio === "4+4") {
    const m2 = toM2(ancho, alto);
    const valor = superficies.vidrios["4+4"] || 0;
    return m2 * valor;
  }

  return datos.vidrios?.[tipoVidrio] || 0;
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

  const [ancho, alto] = medida.split("x").map(Number);

  const colorValor = getColorValor(color);

  const vidrio = calcularVidrioModena(datos, ancho, alto, tipoVidrio);

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
