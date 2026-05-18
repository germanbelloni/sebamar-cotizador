const { fromRoot } = require("../../backend/utils/path");

const perfiles = require(fromRoot("config/perfiles"));

const superficies = require(
  fromRoot("backend/data/productos/superficies.json"),
);

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

  // =========================
  // 💰 PERFIL
  // =========================

  const perfilData = perfiles[perfil]?.moscas || perfiles.amarilla.moscas;

  let costo = costoBase;

  costo *= 1 + perfilData.aumento1;
  costo *= 1 + perfilData.aumento2;

  const venta = costo * (1 + perfilData.ganancia);

  // =========================
  // ✅ RESPONSE
  // =========================

  return {
    costoBase: Math.round(costoBase),

    costo: Math.round(costo),

    precioProveedor: Math.round(costo),

    precioVenta: Math.round(venta),

    ganancia: Math.round(venta - costo),

    items,

    descripcion: `Mosquitero fijo ${ancho}x${alto}`,

    configuracion: {
      ancho,
      alto,
      color,
    },
  };
}

module.exports = calcularMosquiteroFijo;
