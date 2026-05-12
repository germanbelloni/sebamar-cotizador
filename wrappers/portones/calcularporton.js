const { fromRoot } = require("../../backend/utils/path");

const calcularportones = require(
  fromRoot("backend/services/portones/calcularportones"),
);

const perfiles = require(fromRoot("config/perfiles"));

const superficies = require(
  fromRoot("backend/data/productos/superficies.json"),
);

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

function calcularportonWrapper(dataInput) {
  const {
    perfil = "amarilla",
    linea,
    color = "blanco",
    tipo,
    hojas = 2,
  } = dataInput;

  // ========================
  // 🧠 SERVICE
  // ========================

  const resultado = calcularportones(dataInput);

  let costo = Number(resultado.costoBase || 0);

  const items = [...(resultado.items || [])];

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
  // 🚪 HERRAJES
  // ========================

  if (tipo === "corredizo" && hojas >= 3) {
    const extra = superficies.herrajes?.corredizo || 0;

    costo += extra;

    items.push({
      tipo: "herraje_corredizo",
      precio: Math.round(extra),
    });
  }

  if (tipo === "plegadizo") {
    const extra = superficies.herrajes?.plegadizo || 0;

    costo += extra;

    items.push({
      tipo: "herraje_plegadizo",
      precio: Math.round(extra),
    });
  }

  // ========================
  // 💰 PERFIL
  // ========================

  const perfilData = perfiles[perfil]?.[linea] || perfiles.amarilla[linea];

  const costoFinal = costo * (1 - perfilData.descuento);

  const proveedor = costoFinal * (1 + perfilData.flete);

  const venta = proveedor * (1 + perfilData.ganancia);

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

    descripcion: "Portón",

    configuracion: {
      ...resultado.configuracion,
      linea,
      color,
      tipo,
      hojas,
    },
  };
}

module.exports = calcularportonWrapper;
