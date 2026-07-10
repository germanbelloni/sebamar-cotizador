const { fromRoot } = require("../../utils/path");

const data = require(fromRoot("backend/data/productos/superficies.json"));

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
    tipo,
    ancho,
    alto,
    linea,
    tipoVidrio,
    premarco = false,
    contramarco = false,
  } = dataInput;

  if (!tipo || !ancho || !alto) {
    throw new Error("Faltan datos");
  }

  const perimetro = calcularPerimetro(ancho, alto);

  let costoPerfil = 0;
  let costoVidrio = 0;

  const items = [];

  // ======================
  // 🪟 PAÑO FIJO
  // ======================

  if (tipo === "pano_fijo") {
    if (premarco) {
      const precioPremarco = perimetro * data.superficies.premarco;

      costoPerfil += precioPremarco;

      items.push({
        tipo: "premarco",
        descripcion: "premarco",
        precio: Math.round(precioPremarco),
      });
    }

    if (contramarco) {
      const precioContramarco = perimetro * data.superficies.contramarco;

      costoPerfil += precioContramarco;

      items.push({
        tipo: "contramarco",
        descripcion: "contramarco",
        precio: Math.round(precioContramarco),
      });
    }
    if (!linea || !tipoVidrio) {
      throw new Error("Faltan datos para paño fijo");
    }

    const base = data.superficies.pano_fijo[linea];

    if (!base) {
      throw new Error(`Linea inválida: ${linea}`);
    }

    costoPerfil = perimetro * base;

    const precioVidrio = data.vidrios[tipoVidrio];

    if (!precioVidrio) {
      throw new Error(`Vidrio inválido: ${tipoVidrio}`);
    }

    const m2 = calcularM2(ancho, alto);

    costoVidrio = m2 * precioVidrio;

    items.push({
      tipo: "estructura",
      descripcion: linea,
      precio: Math.round(costoPerfil),
    });

    items.push({
      tipo: "vidrio",
      descripcion: tipoVidrio,
      precio: Math.round(costoVidrio),
    });
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

    items.push({
      tipo: "estructura",
      descripcion: "premarco",
      precio: Math.round(costoPerfil),
    });
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

    items.push({
      tipo: "estructura",
      descripcion: "contramarco",
      precio: Math.round(costoPerfil),
    });
  }

  // ======================
  // ❌ INVALIDO
  // ======================
  else {
    throw new Error(`Tipo inválido: ${tipo}`);
  }

  // ======================
  // 💰 TOTAL
  // ======================

  const costoBase = costoPerfil + costoVidrio;

  return {
    costoBase: Math.round(costoBase),

    items,

    configuracion: {
      tipo,
      ancho,
      alto,
      linea,
      tipoVidrio,
    },
  };
}

module.exports = calcularSuperficie;
