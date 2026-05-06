const { fromRoot } = require("../../backend/utils/path");

const calcularSuperficie = require(
  fromRoot("services/superficies/Superficies"),
);

const perfiles = require(fromRoot("config/perfiles"));

// ========================
// 🧠 MAIN
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
    color,
    tipoVidrio,
  });

  const costoBase = resultado.costo || 0;
  let totalCosto = costoBase;

  const items = [];

  // ========================
  // 🧾 ITEMS
  // ========================
  if (tipo === "pano_fijo") {
    items.push({
      tipo: "perfil",
      precio: resultado.detalle.perfil,
    });

    if (resultado.detalle.vidrio > 0) {
      items.push({
        tipo: "vidrio",
        precio: resultado.detalle.vidrio,
      });
    }
  }

  if (tipo === "premarco") {
    items.push({
      tipo: "premarco",
      precio: resultado.detalle.perfil,
    });
  }

  if (tipo === "contramarco") {
    items.push({
      tipo: "contramarco",
      precio: resultado.detalle.perfil,
    });
  }

  // ========================
  // 💰 PERFIL
  // ========================
  const perfilData = perfiles[perfil]?.[linea];

  if (!perfilData) {
    throw new Error(`Perfil inválido: ${perfil} - ${linea}`);
  }

  const costo = totalCosto * (1 - perfilData.descuento);
  const proveedor = costo * (1 + perfilData.flete);
  const venta = proveedor * (1 + perfilData.ganancia);

  // ========================
  // 🧾 DESCRIPCIÓN
  // ========================
  let descripcion = "";

  if (tipo === "pano_fijo") {
    descripcion = `Paño fijo ${linea} ${ancho}x${alto}`;
    if (tipoVidrio) descripcion += ` vidrio ${tipoVidrio}`;
    if (color !== "blanco") descripcion += ` ${color}`;
  }

  if (tipo === "premarco") {
    descripcion = `Premarco ${ancho}x${alto}`;
  }

  if (tipo === "contramarco") {
    descripcion = `Contramarco ${ancho}x${alto}`;
    if (color !== "blanco") descripcion += ` ${color}`;
  }

  // ========================
  // 🧠 CONFIG
  // ========================
  const configuracion = {
    tipo,
    ancho,
    alto,
    linea,
    color,
    tipoVidrio,
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

module.exports = calcularSuperficiesWrapper;
