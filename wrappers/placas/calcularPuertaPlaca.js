const { fromRoot } = require("../../backend/utils/path");

const calcularBase = require(
  fromRoot("backend/services/placas/calcularPuertaPlaca"),
);

const buildWrapperResponse = require(
  fromRoot("backend/utils/buildWrapperResponse"),
);

const AuditBuilder = require(fromRoot("backend/audit/AuditBuilder"));

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
function buildPuertaSVG({ mano = "derecha", tipo }) {
  if (tipo === "granero") {
    return {
      tipo: "granero",
      layout: [],
      svgKey: "puerta_granero",
    };
  }

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
  const audit = new AuditBuilder();
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
  // 🔧 NORMALIZAR MODELOS LEGACY
  // ========================
  if (tipo === "placa" && modelo === "finger_cedro") {
    modelo = "pino_cedro";
  }

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
  audit.add({
    etapa: "Lookup",
    tipo: "lookup",
    origen: "puertas_placa.json",
    referencia: medidaBase,
    metadata: {
      anchoSolicitado: ancho,
      altoSolicitado: alto,
      anchoLookup: anchoNorm.lookup,
      altoLookup: altoNorm.lookup,
    },
  });
  console.log("DEBUG PLACAS:", {
    tipo,
    modelo,
    marco,
    ancho,
    alto,
  });
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

  audit.add({
    etapa: "Costo Base",

    tipo: "base",

    origen: "puertas_placa.json",

    valorAntes: 0,

    valorAplicado: costoBase,

    valorDespues: costoBase,

    metadata: {
      tipo,
      modelo,
      marco,
      medida: medidaBase,
    },
  });

  // ========================
  // 📐 RECARGOS
  // ========================
  let costoConRecargos = costoBase;

  if (anchoNorm.recargo !== 1) {
    const antes = costoConRecargos;

    costoConRecargos *= anchoNorm.recargo;

    audit.add({
      etapa: "Recargo Ancho",
      tipo: "recargo",
      origen: "wrapper",

      referencia: `${ancho}px`,

      porcentaje: anchoNorm.recargo - 1,

      valorAntes: antes,
      valorAplicado: costoConRecargos - antes,
      valorDespues: costoConRecargos,

      metadata: {
        ancho,
        lookup: anchoNorm.lookup,
      },
    });
  }

  if (altoNorm.recargo !== 1) {
    const antes = costoConRecargos;

    costoConRecargos *= altoNorm.recargo;

    audit.add({
      etapa: "Recargo Alto",
      tipo: "recargo",
      origen: "wrapper",

      referencia: `${alto}px`,

      porcentaje: altoNorm.recargo - 1,

      valorAntes: antes,
      valorAplicado: costoConRecargos - antes,
      valorDespues: costoConRecargos,

      metadata: {
        alto,
        lookup: altoNorm.lookup,
      },
    });
  }
  // ========================
  // 💰 PERFIL + AUMENTO
  // ========================
  const perfilData = perfiles[perfil]?.placa || perfiles.amarilla.placa;

  const aumento = perfilData.aumento || 0;

  let costo = costoConRecargos * (1 + aumento);
  costo *= 1 - perfilData.descuento;

  const proveedor = costo; // 👈 placas no tiene flete
  const venta = proveedor * (1 + perfilData.ganancia);

  audit.add({
    etapa: "Perfil",

    tipo: "perfil",

    origen: "perfiles.js",

    referencia: perfil,

    valorAntes: costoConRecargos,

    valorAplicado: venta - costoConRecargos,

    valorDespues: venta,

    porcentaje: perfilData.ganancia,

    metadata: {
      aumento,
      descuento: perfilData.descuento,
      ganancia: perfilData.ganancia,

      proveedor,
      venta,
    },
  });
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
  let descripcion;

  if (tipo === "granero") {
    descripcion = `Puerta granero ${modelo} ${ancho}x${alto}`;
  } else {
    descripcion = `Puerta placa ${modelo} ${ancho}x${alto}`;
  }
  if (tipo !== "granero") {
    if (marco) descripcion += ` marco ${marco}`;
    if (mano) descripcion += ` mano ${mano}`;
  }
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
    svg: buildPuertaSVG({
      mano,
      tipo,
    }),
  };

  return buildWrapperResponse({
    // IDENTIDAD
    modulo: "placas",
    linea: "placa",

    // COSTOS
    costoBase,
    costo,

    // PRECIOS
    precioBase: costo,
    precioProveedor: proveedor,
    precioLista: venta,
    precioFinal: venta,

    // PERFIL
    perfilAplicado: perfil,
    descuentoAplicado: perfilData.descuento,
    gananciaAplicada: perfilData.ganancia,
    margenAplicado: Math.round(perfilData.ganancia * 100),

    // RESULTADO
    ganancia: venta - costo,

    items,

    descripcion,

    configuracion,

    audit: audit.getSteps(),
  });
}

module.exports = calcularWrapper;
