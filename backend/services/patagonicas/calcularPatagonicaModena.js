const { fromRoot } = require("../../utils/path");

const superficies = require(
  fromRoot("backend/data/productos/superficies.json"),
);

const data = require(
  fromRoot("backend/data/productos/patagonicas_modena.json"),
);

// =========================
// 📏 NORMALIZAR
// =========================

function normalizarMedida(medida) {
  if (!medida) {
    throw new Error("Medida inválida");
  }

  return medida.trim().toLowerCase();
}

// =========================
// 🪟 VIDRIO
// =========================

function calcularVidrio(datos, ancho, alto, tipoVidrio) {
  if (!tipoVidrio) {
    return 0;
  }

  // DVH clásico
  // DVH 4+9+4
  if (tipoVidrio === "dvh" || tipoVidrio === "DVH 4+9+4") {
    const vidrio4 = datos.vidrios?.["4mm"] || 0;

    const camara = datos.camara || 0;

    return vidrio4 * 2 + camara;
  }

  // DVH 5+9+5
  if (tipoVidrio === "dvh_5_9_5" || tipoVidrio === "DVH 5+9+5") {
    const m2 = (ancho * alto) / 10000;

    const ml = ((ancho + alto) * 2) / 100;

    const vidrio5 = superficies.vidrios["5mm"] || 0;

    const camara = superficies.vidrios["dvh"] || 0;

    return m2 * vidrio5 * 2 + ml * camara;
  }

  // Laminado
  if (tipoVidrio === "4+4") {
    const m2 = (ancho * alto) / 10000;

    return m2 * (superficies.vidrios["4+4"] || 0);
  }

  return datos.vidrios?.[tipoVidrio] || 0;
}

// =========================
// 🚀 MAIN
// =========================

function calcularPatagonicaModena(dataInput) {
  const { tipo, medida, tipoVidrio } = dataInput;

  if (!tipo) {
    throw new Error("Falta tipo");
  }

  const medidaKey = normalizarMedida(medida);

  const datos = data.tipos?.[tipo]?.medidas?.[medidaKey];

  if (!datos) {
    throw new Error("Medida no encontrada");
  }

  const [ancho, alto] = medidaKey.split("x").map(Number);

  // =========================
  // 🪟 ESTRUCTURA
  // =========================

  const estructura = datos.base || 0;

  // =========================
  // 🪟 VIDRIO
  // =========================

  const vidrio = calcularVidrio(datos, ancho, alto, tipoVidrio);

  // =========================
  // 🧾 ITEMS
  // =========================

  const items = [
    {
      tipo: "estructura",
      precio: Math.round(estructura),
    },

    {
      tipo: "vidrio",
      descripcion: tipoVidrio,
      precio: Math.round(vidrio),
    },
  ];

  // =========================
  // 💰 TOTAL
  // =========================

  const costoBase = estructura + vidrio;

  return {
    costoBase: Math.round(costoBase),

    items,
  };
}

module.exports = calcularPatagonicaModena;
