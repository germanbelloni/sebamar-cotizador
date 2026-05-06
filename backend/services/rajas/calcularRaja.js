const fs = require("fs");
const { fromRoot } = require("../../utils/path");

// 📏 HELPERS
function toM2(ancho, alto) {
  return (ancho * alto) / 10000;
}

function toML(ancho, alto) {
  return ((ancho + alto) * 2) / 100;
}

// 🪟 VIDRIO (SOLO cálculo técnico)
function calcularVidrio(datos, ancho, alto, tipoVidrio, superficies) {
  if (!tipoVidrio) return 0;

  if (tipoVidrio === "dvh") {
    return (datos.vidrios?.["4mm"] || 0) * 2 + (datos.camara || 0);
  }

  if (tipoVidrio === "dvh_5_9_5") {
    const m2 = toM2(ancho, alto);
    const ml = toML(ancho, alto);
    const v5 = superficies.vidrios["5mm"] || 0;
    const cam = superficies.vidrios["dvh"] || 0;
    return m2 * v5 * 2 + ml * cam;
  }

  if (tipoVidrio === "4+4") {
    const m2 = toM2(ancho, alto);
    return m2 * (superficies.vidrios["4+4"] || 0);
  }

  return datos.vidrios?.[tipoVidrio] || 0;
}

function calcularRaja(dataInput) {
  const { medida, tipoVidrio, linea = "herrero" } = dataInput;

  const superficies = require(
    fromRoot("frontend/data/productos/superficies.json"),
  );

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
  const vidrio = calcularVidrio(datos, ancho, alto, tipoVidrio, superficies);

  return {
    costoBase: base + vidrio,
    items: [
      { tipo: "base", precio: base, costo: base },
      { tipo: "vidrio", descripcion: tipoVidrio, precio: vidrio },
    ],
  };
}

module.exports = calcularRaja;
