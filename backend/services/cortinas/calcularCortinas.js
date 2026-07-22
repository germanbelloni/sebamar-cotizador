const { fromRoot } = require("../../utils/path");

const calcularPrecioCortina = require("./calcularPrecioCortina");

// ======================
// 🧠 MAIN
// ======================

function calcularCortinas(dataInput) {
  const {
    tipo,
    material,
    calidad,
    construccion,
    color = "blanco",
    ancho,
    alto,
    cantidad,
  } = dataInput;

  if (tipo === "varillas") {
    if (!ancho || !cantidad) {
      throw new Error("Faltan datos");
    }
  } else {
    if (!tipo || !material || !ancho || !alto) {
      throw new Error("Faltan datos");
    }
  }

  if (Number(ancho) < 80 || Number(ancho) > 240) {
    throw new Error("Ancho fuera de rango (80 a 240)");
  }

  if (tipo !== "varillas") {
    if (Number(alto) < 50 || Number(alto) > 220) {
      throw new Error("Alto fuera de rango (50 a 220)");
    }
  }

  const altoCalculado =
    tipo === "varillas" ? Number(cantidad) * 5 : Number(alto);

  const { costoBase, precioM2, m2, anchoFinal, altoFinal } =
    calcularPrecioCortina({
      tipo,
      material,
      calidad,
      construccion,
      color,
      ancho,
      alto: altoCalculado,
    });

  // ======================
  // 🧾 ITEMS
  // ======================

  const items = [];

  items.push({
    tipo: "estructura",
    descripcion: tipo === "cajon_block" ? "cajon_block" : "cortina",
    precio: Math.round(costoBase),
  });

  // ======================
  // ✅ RETURN
  // ======================

  return {
    costoBase: Math.round(costoBase),

    anchoFinal,
    altoFinal,

    m2,

    precioM2,

    items,

    configuracion: {
      tipo,
      material,
      calidad,
      construccion,
      color,

      ancho,
      alto,

      anchoFinal,
      altoFinal,
    },
  };
}

module.exports = calcularCortinas;
