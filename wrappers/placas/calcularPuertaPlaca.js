const { fromRoot } = require("../../backend/utils/path");

const calcularBase = require(
  fromRoot("backend/services/placas/calcularPuertaPlaca"),
);

const perfiles = require(fromRoot("backend/config/perfiles"));

// 🔧 NORMALIZAR ANCHO
function normalizarAncho(ancho) {
  if (ancho <= 70) return { lookup: 70, recargo: 1 };
  if (ancho <= 80) return { lookup: 80, recargo: 1 };
  if (ancho <= 90) return { lookup: 80, recargo: 1.1 };
  if (ancho <= 100) return { lookup: 80, recargo: 1.2 };
  throw new Error("Ancho fuera de rango");
}

// 🔧 NORMALIZAR ALTO
function normalizarAlto(alto) {
  if (alto < 150 || alto > 210) {
    throw new Error("Alto fuera de rango");
  }

  if (alto <= 200) return { lookup: 200, recargo: 1 };
  if (alto <= 205) return { lookup: 200, recargo: 1.05 };
  return { lookup: 200, recargo: 1.1 };
}

// 🔹 MAIN
function calcularWrapper(dataInput) {
  let {
    medida,
    ancho,
    alto,
    tipo,
    modelo,
    marco,
    mano,
    extras = {},
    perfil = "amarilla",
  } = dataInput;

  // 📏 PARSEO
  if (medida && medida !== "fuera_medida") {
    [ancho, alto] = medida.split("x").map(Number);
  }

  // VALIDACIONES
  if (ancho < 60 || ancho > 100) {
    throw new Error("Ancho fuera de rango");
  }

  // 🔧 NORMALIZACIÓN
  const anchoNorm = normalizarAncho(ancho);
  const altoNorm = normalizarAlto(alto);

  const medidaBase = `${String(anchoNorm.lookup).padStart(3, "0")}x200`;

  // 🧠 SERVICE
  const resultadoBase = calcularBase({
    tipo,
    modelo,
    medida: medidaBase,
    marco,
  });

  let total = resultadoBase.base;

  // 📐 RECARGOS
  total *= anchoNorm.recargo;
  total *= altoNorm.recargo;

  // ➕ EXTRAS (placeholder)
  if (extras.picaporteBronce) {
    // TODO futuro
  }

  // 💰 PERFIL
  const perfilData = perfiles[perfil]?.placa || perfiles["amarilla"].placa;

  total *= 1 - perfilData.descuento;
  total *= 1 + perfilData.ganancia;

  return {
    total: Math.round(total),
    detalle: {
      tipo,
      modelo,
      medidaBase,
      anchoOriginal: ancho,
      altoOriginal: alto,
      recargoAncho: anchoNorm.recargo,
      recargoAlto: altoNorm.recargo,
      marco,
      mano,
    },
  };
}

module.exports = calcularWrapper;
