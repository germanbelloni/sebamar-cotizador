// wrappers/ventanas/calcularVentanaModena.js

const { fromRoot } = require("../../backend/utils/path");

const calcularVentana = require(
  fromRoot("backend/services/ventanas/calcularVentana"),
);

const perfiles = require(fromRoot("backend/config/perfiles"));

const superficies = require(
  fromRoot("frontend/data/productos/superficies.json"),
);

const colores = require(fromRoot("frontend/data/colores.json"));

// 📐
const calcularM2 = (a, h) => (a * h) / 10000;

const calcularML = (a, h) => (a * 2 + h * 2) / 100;

// 💰 PERFIL
function aplicarPerfil(costo, p) {
  const proveedor = costo * (1 - p.descuento);

  const venta = proveedor * (1 + p.flete) * (1 + p.ganancia);

  return {
    proveedor,
    venta,
  };
}

// 🎨 COLOR
function aplicarColor(items, color) {
  if (!color || color === "blanco") {
    return items;
  }

  const porcentaje = Number(colores?.[color] || 0);

  return items.map((item) => {
    if (item.tipo !== "estructura") {
      return item;
    }

    return {
      ...item,
      precio: Math.round(item.precio * (1 + porcentaje)),
    };
  });
}

// 🚀 WRAPPER
function calcularVentanaModena(dataInput) {
  const {
    ancho,
    alto,
    color = "blanco",
    tipoVidrio,
    mosquitero,
    premarco,
    contramarco,
    perfil = "amarilla",
  } = dataInput;

  if (!ancho || !alto) {
    throw new Error("Faltan medidas");
  }

  const medida = `${ancho}x${alto > 200 ? 200 : alto}`;

  const base = calcularVentana({
    medida,
    tipoVidrio,
    linea: "modena",
  });

  // 🎨 COLOR SOLO ESTRUCTURA
  const items = aplicarColor([...base.items], color);

  let costo = items.reduce((acc, i) => acc + Number(i.precio || 0), 0);

  const m2 = calcularM2(ancho, alto);

  const ml = calcularML(ancho, alto);

  // 🧵 MOSQUITERO
  if (mosquitero) {
    const c = Number(superficies.superficies.mosquitero_fijo || 0) * m2;

    costo += c;

    items.push({
      tipo: "mosquitero",
      precio: Math.round(c),
    });
  }

  // 🪚 PREMARCO
  if (premarco) {
    const c = Number(superficies.superficies.premarco || 0) * ml;

    costo += c;

    items.push({
      tipo: "premarco",
      precio: Math.round(c),
    });
  }

  // 🪚 CONTRAMARCO
  if (premarco || contramarco) {
    const c = Number(superficies.superficies.contramarco || 0) * ml;

    costo += c;

    items.push({
      tipo: "contramarco",
      precio: Math.round(c),
    });
  }

  // 📏 ALTURA
  if (alto > 200) {
    costo *= 1.1;
  }

  // 💰 PERFIL
  const perfilData = perfiles[perfil]?.modena || perfiles.amarilla.modena;

  const { proveedor, venta } = aplicarPerfil(costo, perfilData);

  return {
    costoBase: Math.round(base.costoBase),

    costo: Math.round(costo),

    precioProveedor: Math.round(proveedor),

    precioVenta: Math.round(venta),

    ganancia: Math.round(venta - costo),

    items,

    descripcion: `Ventana modena ${ancho}x${alto}`,

    configuracion: {
      ancho,
      alto,

      color,

      tipoVidrio,

      mosquitero: !!mosquitero,

      premarco: !!premarco,

      contramarco: !!contramarco,

      svg: {
        tipo: "ventana_modena",
        hojas: ancho > 240 ? 2 : 1,
        mosquitero: !!mosquitero,
        premarco: !!premarco,
        contramarco: !!contramarco,
      },
    },
  };
}

module.exports = calcularVentanaModena;
