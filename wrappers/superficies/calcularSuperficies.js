const { fromRoot } = require("../../backend/utils/path");
const calcularSuperficie = require(
  fromRoot("services/superficies/superficies"),
);
const perfiles = require(fromRoot("config/perfiles"));

const colores = require(fromRoot("backend/data/colores.json"));

// ========================
// 🎨 COLOR
// ========================

function getColorFactor(color) {
  const c = colores.find(
    (x) => x.nombre.toLowerCase().trim() === (color || "").toLowerCase().trim(),
  );

  return c ? c.valor : 0;
}

// ========================
// 🚀 WRAPPER
// ========================

function calcularSuperficiesWrapper(dataInput) {
  const {
    tipo,
    ancho,
    alto,
    linea = "herrero",
    color = "blanco",
    tipoVidrio,
    perfil = "amarilla",
  } = dataInput;

  if (!tipo || !ancho || !alto) {
    throw new Error("Faltan datos");
  }

  // ========================
  // 🧠 SERVICE
  // ========================

  const resultado = calcularSuperficie({
    tipo,
    ancho,
    alto,
    linea,
    tipoVidrio,
  });

  let costo = Number(resultado.costoBase || 0);

  const items = [...resultado.items];

  // ========================
  // 🎨 COLOR
  // SOLO ESTRUCTURA
  // ========================

  const estructura = items
    .filter((i) => i.tipo === "estructura")
    .reduce((acc, i) => acc + Number(i.precio || 0), 0);

  const colorFactor = getColorFactor(color);

  const costoColor = estructura * colorFactor;

  if (costoColor > 0) {
    costo += costoColor;

    items.push({
      tipo: "color",
      descripcion: color,
      precio: Math.round(costoColor),
    });
  }

  // ========================
  // 💰 PERFIL
  // ========================

  const perfilData = perfiles[perfil]?.[linea];

  if (!perfilData) {
    throw new Error(`Perfil inválido: ${perfil} - ${linea}`);
  }

  const costoFinal = costo * (1 - perfilData.descuento);

  const proveedor = costoFinal * (1 + perfilData.flete);

  const venta = proveedor * (1 + perfilData.ganancia);

  // ========================
  // 🧾 DESCRIPCIÓN
  // ========================

  let descripcion = "";

  if (tipo === "pano_fijo") {
    descripcion = `Paño fijo ${linea} ${ancho}x${alto}`;

    if (tipoVidrio) {
      descripcion += ` vidrio ${tipoVidrio}`;
    }

    if (color !== "blanco") {
      descripcion += ` ${color}`;
    }
  }

  if (tipo === "premarco") {
    descripcion = `Premarco ${ancho}x${alto}`;
  }

  if (tipo === "contramarco") {
    descripcion = `Contramarco ${ancho}x${alto}`;

    if (color !== "blanco") {
      descripcion += ` ${color}`;
    }
  }

  // ========================
  // 🧠 CONFIG
  // ========================

  const configuracion = {
    tipo,
    ancho,
    alto,
  };

  if (tipo === "pano_fijo") {
    configuracion.linea = linea;
    configuracion.color = color;
    configuracion.tipoVidrio = tipoVidrio;
  }

  if (tipo === "contramarco") {
    configuracion.color = color;
  }

  // ========================
  // ✅ RESPONSE
  // ========================

  return {
    costoBase: Math.round(resultado.costoBase || 0),

    costo: Math.round(costoFinal),

    precioProveedor: Math.round(proveedor),

    precioVenta: Math.round(venta),

    ganancia: Math.round(venta - costoFinal),

    items: items.map((i) => ({
      tipo: i.tipo,
      descripcion: i.descripcion,
      precio: Math.round(i.precio || 0),
    })),

    descripcion,

    configuracion,
  };
}

module.exports = calcularSuperficiesWrapper;
