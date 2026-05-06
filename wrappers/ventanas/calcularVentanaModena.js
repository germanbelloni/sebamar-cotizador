const { fromRoot } = require("../../backend/utils/path");

const calcularVentana = require(
  fromRoot("backend/services/ventanas/calcularVentana"),
);

const { buildPatagonicaSVG } = require(fromRoot("utils/svg"));

const perfiles = require(fromRoot("backend/config/perfiles"));
const superficies = require(
  fromRoot("frontend/data/productos/superficies.json"),
);

// 📐
const calcularM2 = (a, h) => (a * h) / 10000;
const calcularML = (a, h) => (a * 2 + h * 2) / 100;

// 💰 PERFIL
function aplicarPerfil(costo, p) {
  const proveedor = costo * (1 - p.descuento);
  const venta = proveedor * (1 + p.flete) * (1 + p.ganancia);

  return { proveedor, venta };
}

// 🚀 WRAPPER
function calcularVentanaModena(dataInput) {
  const {
    ancho,
    alto,
    color,
    tipoVidrio,
    mosquitero,
    premarco,
    contramarco,
    perfil = "amarilla",
  } = dataInput;

  if (!ancho || !alto) throw new Error("Faltan medidas");

  const medida = `${ancho}x${alto > 200 ? 200 : alto}`;

  const base = calcularVentana({
    medida,
    color,
    tipoVidrio,
    linea: "modena",
  });

  let costo = base.costoBase;
  const items = [];

  items.push({
    tipo: "base",
    precio: Math.round(base.costoBase),
  });

  const m2 = calcularM2(ancho, alto);
  const ml = calcularML(ancho, alto);

  // 🧵 MOSQUITERO
  if (mosquitero) {
    const c = superficies.superficies.mosquitero_fijo * m2;
    costo += c;

    items.push({ tipo: "mosquitero", precio: Math.round(c) });
  }

  // 🪚 PREMARCO / CONTRAMARCO
  if (premarco) {
    const c = superficies.superficies.premarco * ml;
    costo += c;

    items.push({ tipo: "premarco", precio: Math.round(c) });
  }

  if (premarco || contramarco) {
    const c = superficies.superficies.contramarco * ml;
    costo += c;

    items.push({ tipo: "contramarco", precio: Math.round(c) });
  }

  // 📏 ALTURA
  if (alto > 200) costo *= 1.1;

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
      mosquitero,
      premarco,
      contramarco,

      // 🔥 SVG
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
