const { fromRoot } = require("../../backend/utils/path");

const perfiles = require(fromRoot("config/perfiles"));

const superficies = require(
  fromRoot("backend/data/productos/superficies.json"),
);
const buildWrapperResponse = require(
  fromRoot("backend/utils/buildWrapperResponse"),
);
const AuditBuilder = require(fromRoot("backend/audit/AuditBuilder"));

const colores = require(fromRoot("backend/data/colores.json"));

// =========================
// 🎨 COLOR
// =========================

function getColorFactor(color) {
  const c = colores.find(
    (x) => x.nombre.toLowerCase().trim() === (color || "").toLowerCase().trim(),
  );

  return c ? c.valor : 0;
}

// =========================
// 🚀 MAIN
// =========================

function calcularMosquiteroFijo(dataInput) {
  const audit = new AuditBuilder();
  const { ancho, alto, color = "blanco", perfil = "amarilla" } = dataInput;

  if (!ancho || !alto) {
    throw new Error("Faltan medidas");
  }

  // =========================
  // 📐 M2
  // =========================

  const m2 = (ancho * alto) / 10000;

  // =========================
  // 💰 BASE
  // =========================

  const precioM2 = superficies.superficies?.mosquitero_fijo;

  if (!precioM2) {
    throw new Error("Falta precio mosquitero fijo");
  }

  let costoBase = precioM2 * m2;

  const items = [
    {
      tipo: "estructura",
      descripcion: `${ancho}x${alto}`,
      precio: Math.round(costoBase),
    },
  ];

  audit.add({
    etapa: "Costo Base",

    tipo: "base",

    origen: "superficies.json",

    valorAntes: 0,

    valorAplicado: costoBase,

    valorDespues: costoBase,

    metadata: {
      ancho,
      alto,
      precioM2,
    },
  });

  // =========================
  // 🎨 COLOR
  // =========================

  const colorFactor = getColorFactor(color);

  const costoColor = costoBase * colorFactor;

  if (costoColor > 0) {
    costoBase += costoColor;

    items.push({
      tipo: "color",
      descripcion: color,
      precio: Math.round(costoColor),
    });
  }

  audit.add({
    etapa: "Color",

    tipo: "color",

    descripcion: `Recargo color ${color}`,

    origen: "colores.json",

    referencia: color,

    porcentaje: colorFactor,

    valorAntes: costoBase - costoColor,

    valorAplicado: costoColor,

    valorDespues: costoBase,

    metadata: {
      estructuraOriginal: costoBase - costoColor,
      estructuraColor: costoBase,
      incremento: costoColor,
      porcentajeColor: colorFactor,
    },
  });

  // =========================
  // 💰 PERFIL
  // =========================

  const perfilData = perfiles[perfil]?.moscas || perfiles.amarilla.moscas;

  let costo = costoBase;

  costo *= 1 + perfilData.aumento1;
  costo *= 1 + perfilData.aumento2;

  const venta = costo * (1 + perfilData.ganancia);

  audit.add({
    etapa: "Perfil",

    tipo: "perfil",

    origen: "perfiles.js",

    referencia: perfil,

    valorAntes: costo,

    valorAplicado: venta - costo,

    valorDespues: venta,

    porcentaje: perfilData.ganancia,

    metadata: {
      aumento1: perfilData.aumento1,
      aumento2: perfilData.aumento2,
      ganancia: perfilData.ganancia,

      proveedor: costo,
      venta,
    },
  });

  // =========================
  // ✅ RESPONSE
  // =========================

  return buildWrapperResponse({
    modulo: "mosquiteros",

    linea: "moscas",

    costoBase,

    costo,

    precioBase: costo,

    precioProveedor: costo,

    precioLista: venta,

    precioFinal: venta,

    perfilAplicado: perfil,

    descuentoAplicado: 0,

    fleteAplicado: 0,

    gananciaAplicada: perfilData.ganancia,

    margenAplicado: 0,

    ganancia: venta - costo,

    items,

    descripcion: `Mosquitero fijo ${ancho}x${alto}`,

    configuracion: {
      ancho,
      alto,
      color,
    },

    audit: audit.getSteps(),
  });
}

module.exports = calcularMosquiteroFijo;
