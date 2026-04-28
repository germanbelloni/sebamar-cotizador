const fs = require("fs");
const { fromRoot } = require("../../utils/path");

const colores = require(fromRoot("frontend/data/colores.json"));
const superficies = require(
  fromRoot("frontend/data/productos/superficies.json"),
);

// 🎨 COLOR
function getColorValor(color) {
  const c = colores.find(
    (x) => x.nombre.toLowerCase().trim() === (color || "").toLowerCase().trim(),
  );
  return c ? c.valor : 0;
}

// 📏 HELPERS
function toM2(ancho, alto) {
  return (ancho * alto) / 10000;
}

function toML(ancho, alto) {
  return ((ancho + alto) * 2) / 100;
}

// 🪟 VIDRIO
function calcularVidrio(datos, ancho, alto, tipoVidrio) {
  if (!tipoVidrio) return 0;

  if (tipoVidrio === "dvh") {
    return (datos.vidrios?.["4mm"] || 0) * 2 + (datos.vidrios?.["dvh"] || 0);
  }

  if (tipoVidrio === "dvh_5_9_5") {
    const m2 = toM2(ancho, alto);
    const perimetro = toML(ancho, alto);

    const vidrio5 = superficies.vidrios["5mm"] || 0;
    const camara = superficies.vidrios["dvh"] || 0;

    return m2 * vidrio5 * 2 + perimetro * camara;
  }

  if (tipoVidrio === "4+4") {
    const m2 = toM2(ancho, alto);
    const valor = superficies.vidrios["4+4"] || 0;
    return m2 * valor;
  }

  return datos.vidrios?.[tipoVidrio] || 0;
}

function calcularRaja(dataInput) {
  const { medida, tipoVidrio, color, linea = "herrero" } = dataInput;

  const filePath = fromRoot(`frontend/data/productos/rajas_${linea}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  let datos = null;

  if (data.tipos) {
    for (const tipo in data.tipos) {
      const medidas = data.tipos[tipo].medidas;
      if (medidas?.[medida]) {
        datos = medidas[medida];
        break;
      }
    }
  }

  if (!datos && data.medidas) {
    datos = data.medidas[medida];
  }

  if (!datos) {
    throw new Error(`Medida no encontrada: ${medida}`);
  }

  const [ancho, alto] = medida.split("x").map(Number);

  const base = datos.base || 0;
  const vidrio = calcularVidrio(datos, ancho, alto, tipoVidrio);

  const colorValor = getColorValor(color);

  const costoBase = (base + vidrio) * (1 + colorValor);

  return {
    costoBase,
  };
}

module.exports = calcularRaja;
