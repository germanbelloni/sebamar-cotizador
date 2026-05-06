const { fromRoot } = require("../../utils/path");

const data = require(fromRoot("frontend/data/productos/superficies.json"));

// ======================
// 🎯 HELPERS
// ======================
function calcularPerimetro(ancho, alto) {
  return (ancho * 2 + alto * 2) / 100;
}

function calcularM2(ancho, alto) {
  return (ancho * alto) / 10000;
}

// ======================
// 🧠 MAIN
// ======================
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

  const perimetro = calcularPerimetro(ancho, alto);

  let costoPerfil = 0;
  let costoVidrio = 0;

  // ======================
  // 🪟 PAÑO FIJO
  // ======================
  if (tipo === "pano_fijo") {
    if (!linea || !tipoVidrio) {
      throw new Error("Faltan datos para paño fijo");
    }

    const base = data.superficies.pano_fijo[linea];

    if (!base) {
      throw new Error(`Linea inválida: ${linea}`);
    }

    costoPerfil = perimetro * base;

    // 🎨 COLOR (solo perfil)
    if (color !== "blanco") {
      const recargo = data.recargos[color];
      if (!recargo) throw new Error(`Color inválido: ${color}`);
      costoPerfil *= recargo;
    }

    // 🪟 VIDRIO
    const precioVidrio = data.vidrios[tipoVidrio];
    if (!precioVidrio) throw new Error(`Vidrio inválido: ${tipoVidrio}`);

    const m2 = calcularM2(ancho, alto);
    costoVidrio = m2 * precioVidrio;
  }

  // ======================
  // 📦 PREMARCO
  // ======================
  else if (tipo === "premarco") {
    const base = data.superficies.premarco;

    if (!base) {
      throw new Error("No existe precio de premarco");
    }

    costoPerfil = perimetro * base;
  }

  // ======================
  // 📦 CONTRAMARCO
  // ======================
  else if (tipo === "contramarco") {
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

  // ======================
  // ❌ INVALIDO
  // ======================
  else {
    throw new Error(`Tipo inválido: ${tipo}`);
  }

  const costoTotal = costoPerfil + costoVidrio;

  return {
    costo: Math.round(costoTotal),
    detalle: {
      perfil: Math.round(costoPerfil),
      vidrio: Math.round(costoVidrio),
    },
  };
}

module.exports = calcularSuperficie;
