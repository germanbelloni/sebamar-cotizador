const { fromRoot } = require("../../utils/path");

const data = require(fromRoot("backend/data/productos/superficies.json"));

// ======================
// 🎯 HELPERS
// ======================

function calcularM2(ancho, alto) {
  return (Number(ancho) * Number(alto)) / 10000;
}

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
  } = dataInput;

  if (!tipo || !material || !ancho || !alto) {
    throw new Error("Faltan datos");
  }

  if (Number(ancho) < 80 || Number(ancho) > 240) {
    throw new Error("Ancho fuera de rango (80 a 240)");
  }

  if (Number(alto) < 50 || Number(alto) > 220) {
    throw new Error("Alto fuera de rango (50 a 220)");
  }

  const m2 = calcularM2(ancho, alto);

  let precioM2 = 0;

  // ======================
  // 📦 CAJON BLOCK
  // ======================

  if (tipo === "cajon_block") {
    precioM2 = data.superficies.cajon_block_precios?.[material];
  }

  // ======================
  // 🪟 CORTINA PVC
  // ======================
  else if (tipo === "cortina" && material === "pvc") {
    if (!calidad || !construccion) {
      throw new Error("Faltan datos de la cortina PVC");
    }

    precioM2 = data.superficies.cortinas_modulo?.pvc?.[calidad]?.[construccion];
  }

  // ======================
  // 🪟 CORTINA ALUMINIO
  // ======================
  else if (tipo === "cortina" && material === "aluminio") {
    if (!color || !construccion) {
      throw new Error("Faltan datos de la cortina de aluminio");
    }

    precioM2 =
      data.superficies.cortinas_modulo?.aluminio?.[color]?.[construccion];
  }

  // ======================
  // ❌ INVALIDO
  // ======================
  else {
    throw new Error("Configuración inválida");
  }

  if (precioM2 == null) {
    throw new Error("No existe precio configurado");
  }

  const costoBase = m2 * precioM2;

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

    items,

    configuracion: {
      tipo,
      material,
      calidad,
      construccion,
      color,

      ancho,
      alto,

      anchoFinal: tipo === "cajon_block" ? Number(ancho) + 8 : null,

      altoFinal: tipo === "cajon_block" ? Number(alto) + 18 : null,
    },
  };
}

module.exports = calcularCortinas;
