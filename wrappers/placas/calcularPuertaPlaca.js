const { fromRoot } = require("../../backend/utils/path");

const calcularBase = require(
  fromRoot("backend/services/placas/calcularPuertaPlaca"),
);

const perfiles = require(fromRoot("backend/config/perfiles"));

// ========================
// 🔧 NORMALIZAR ANCHO
// ========================
function normalizarAncho(ancho) {
  if (ancho <= 70) return { lookup: 70, recargo: 1 };
  if (ancho <= 80) return { lookup: 80, recargo: 1 };
  if (ancho <= 90) return { lookup: 80, recargo: 1.1 };
  if (ancho <= 100) return { lookup: 80, recargo: 1.2 };

  throw new Error("Ancho fuera de rango");
}

// ========================
// 🔧 NORMALIZAR ALTO
// ========================
function normalizarAlto(alto) {
  if (alto < 150 || alto > 210) {
    throw new Error("Alto fuera de rango");
  }

  if (alto <= 200) return { lookup: 200, recargo: 1 };
  if (alto <= 205) return { lookup: 200, recargo: 1.05 };
  return { lookup: 200, recargo: 1.1 };
}

// ========================
// 🎯 SVG
// ========================
function buildPuertaSVG({ mano = "derecha" }) {
  if (mano === "izquierda") {
    return {
      tipo: "puerta",
      layout: ["bisagra_izq"],
      svgKey: "puerta_izq",
    };
  }

  return {
    tipo: "puerta",
    layout: ["bisagra_der"],
    svgKey: "puerta_der",
  };
}

// ========================
// 🧠 MAIN
// ========================
function calcularWrapper(dataInput) {
  let {
    medida,
    ancho,
    alto,
    tipo,
    modelo,
    marco,
    mano,
    perfil = "amarilla",
  } = dataInput;

  // ========================
  // 📏 PARSEO
  // ========================
  if (medida && medida !== "fuera_medida") {
    [ancho, alto] = medida.split("x").map(Number);
  }

  if (!ancho || !alto) {
    throw new Error("Faltan dimensiones");
  }

  // ========================
  // 🔧 NORMALIZACIÓN
  // ========================
  const anchoNorm = normalizarAncho(ancho);
  const altoNorm = normalizarAlto(alto);

  const medidaBase = `${String(anchoNorm.lookup).padStart(3, "0")}x200`;

  // ========================
  // 🧠 SERVICE
  // ========================
  const base = calcularBase({
    tipo,
    modelo,
    medida: medidaBase,
    marco,
  });

  const costoBase = base.base;

  // ========================
  // 📐 RECARGOS
  // ========================
  let costoConRecargos = costoBase;
  costoConRecargos *= anchoNorm.recargo;
  costoConRecargos *= altoNorm.recargo;

  // ========================
  // 💰 PERFIL + AUMENTO
  // ========================
  const perfilData = perfiles[perfil]?.placa || perfiles.amarilla.placa;

  const aumento = perfilData.aumento || 0;

  let costo = costoConRecargos * (1 + aumento);
  costo *= 1 - perfilData.descuento;

  const proveedor = costo; // 👈 placas no tiene flete
  const venta = proveedor * (1 + perfilData.ganancia);

  // ========================
  // 🧾 ITEMS
  // ========================
  const items = [
    {
      tipo: "base",
      descripcion: `${tipo} ${modelo} ${medidaBase}`,
      precio: Math.round(costoBase),
      costo: Math.round(costoBase),
    },
  ];

  // ========================
  // 🧾 DESCRIPCIÓN
  // ========================
  let descripcion = `Puerta placa ${modelo} ${ancho}x${alto}`;

  if (marco) descripcion += ` marco ${marco}`;
  if (mano) descripcion += ` mano ${mano}`;

  // ========================
  // ⚙️ CONFIG
  // ========================
  const configuracion = {
    ancho,
    alto,
    medidaBase,
    tipo,
    modelo,
    marco,
    mano,
    recargoAncho: anchoNorm.recargo,
    recargoAlto: altoNorm.recargo,
    svg: buildPuertaSVG({ mano }),
  };

  return {
    costoBase: Math.round(costoBase),
    costo: Math.round(costo),
    precioProveedor: Math.round(proveedor),
    precioVenta: Math.round(venta),
    ganancia: Math.round(venta - costo),
    items,
    descripcion,
    configuracion,
  };
}

module.exports = calcularWrapper;
