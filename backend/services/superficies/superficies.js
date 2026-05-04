const { fromRoot } = require("../../utils/path");

const data = require(fromRoot("frontend/data/productos/superficies.json"));

// 🎯 MAIN
function calcularSuperficie(dataInput) {
  const {
    tipo, // pano_fijo | premarco | contramarco
    ancho,
    alto,
    linea,
    color = "blanco",
    tipoVidrio,
  } = dataInput;

  if (!tipo || !ancho || !alto) {
    throw new Error("Faltan datos");
  }

  // 📏 PERÍMETRO EN METROS
  const perimetro = (ancho * 2 + alto * 2) / 100;

  let costoPerfil = 0;
  let costoVidrio = 0;

  // =====================
  // 🪟 PAÑO FIJO
  // =====================
  if (tipo === "pano_fijo") {
    if (!linea || !tipoVidrio) {
      throw new Error("Faltan datos para paño fijo");
    }

    const base = data.superficies.pano_fijo[linea];

    if (!base) {
      throw new Error(`Linea inválida: ${linea}`);
    }

    costoPerfil = perimetro * base;

    // 🎨 COLOR
    if (color !== "blanco") {
      const recargo = data.recargos[color];
      if (!recargo) throw new Error(`Color inválido: ${color}`);
      costoPerfil *= recargo;
    }

    // 🪟 VIDRIO (m²)
    const precioVidrio = data.vidrios[tipoVidrio];
    if (!precioVidrio) throw new Error(`Vidrio inválido: ${tipoVidrio}`);

    const m2 = (ancho * alto) / 10000;
    costoVidrio = m2 * precioVidrio;
  }

  // =====================
  // 📦 PREMARCO
  // =====================
  if (tipo === "premarco") {
    const base = data.superficies.premarco;

    if (!base) {
      throw new Error("No existe precio de premarco");
    }

    costoPerfil = perimetro * base;
  }

  // =====================
  // 📦 CONTRAMARCO
  // =====================
  if (tipo === "contramarco") {
    const base = data.superficies.contramarco;

    if (!base) {
      throw new Error("No existe precio de contramarco");
    }

    costoPerfil = perimetro * base;

    // 🎨 COLOR
    if (color !== "blanco") {
      const recargo = data.recargos[color];
      if (!recargo) throw new Error(`Color inválido: ${color}`);
      costoPerfil *= recargo;
    }
  }

  // =====================
  // ❌ TIPO INVALIDO
  // =====================
  if (!["pano_fijo", "premarco", "contramarco"].includes(tipo)) {
    throw new Error(`Tipo inválido: ${tipo}`);
  }

  const costo = costoPerfil + costoVidrio;

  return {
    costo: Math.round(costo),
    detalle: {
      perfil: Math.round(costoPerfil),
      vidrio: Math.round(costoVidrio),
    },
  };
}

module.exports = calcularSuperficie;
