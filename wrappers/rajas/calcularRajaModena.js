// wrappers/rajas/calcularRajaModena.js

const { fromRoot } = require("../../backend/utils/path");

const calcularRaja = require(fromRoot("backend/services/rajas/calcularRaja"));

const superficies = require(
  fromRoot("backend/data/productos/superficies.json"),
);

const perfiles = require(fromRoot("backend/config/perfiles"));

const colores = require(fromRoot("backend/data/colores.json"));

const data = require(fromRoot("backend/data/productos/rajas_modena.json"));

// 📐
const calcularM2 = (a, h) => (a * h) / 10000;

const calcularML = (a, h) => (a * 2 + h * 2) / 100;

// 🔍
function buscarMedidaValida(ancho, alto) {
  const objetivo = ancho * 2 + alto * 2;

  const medidas = Object.keys(data.medidas);

  const medidasOrdenadas = medidas
    .map((m) => {
      const [a, h] = m.split("x").map(Number);

      const perimetro = a * 2 + h * 2;

      return {
        key: m,
        diferencia: Math.abs(perimetro - objetivo),
      };
    })
    .sort((a, b) => a.diferencia - b.diferencia);

  if (!medidasOrdenadas.length) {
    throw new Error("No hay medida válida");
  }

  return medidasOrdenadas[0].key;
}

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

  const colorData = colores.find((c) => c.nombre === color);

  const porcentaje = Number(colorData?.valor || 0);

  return items.map((item) => {
    if (item.tipo !== "estructura") {
      return item;
    }

    const nuevoPrecio = Math.round(item.precio * (1 + porcentaje));

    return {
      ...item,
      precio: nuevoPrecio,
      subtotal: nuevoPrecio,
    };
  });
}

// 🚀 MAIN
function calcularRajaModena(dataInput) {
  const {
    ancho,
    alto,
    vidrio,
    color = "blanco",
    mosquitero,
    herrajesBlancos,
    modelo = "raja",
    premarco,
    contramarco,
    perfil = "amarilla",
    bisagra,
  } = dataInput;

  if (!ancho || !alto) {
    throw new Error("Faltan medidas");
  }

  const medida = buscarMedidaValida(ancho, alto);

  const vidrioFinal = vidrio || "4mm";

  const base = calcularRaja({
    medida,
    tipoVidrio: vidrioFinal,
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

  // 🔧 OSCILOBATIENTE
  if (modelo === "oscilobatiente") {
    const c = Number(superficies.extras.oscilobatiente || 0);

    costo += c;

    items.push({
      tipo: "oscilobatiente",
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
  if (alto > 150) {
    costo *= 1.3;
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

    descripcion: `Raja Modena ${ancho}x${alto}`,

    configuracion: {
      ancho,
      alto,

      medidaUsada: medida,

      color,

      vidrio: vidrioFinal,

      mosquitero: !!mosquitero,

      modelo,

      premarco: !!premarco,

      contramarco: !!contramarco,

      herrajesBlancos: !!herrajesBlancos,

      svg: {
        tipo: "raja_modena",

        apertura: modelo,

        bisagra: bisagra
          ? {
              tipo: bisagra,

              svgKey:
                bisagra === "izquierda"
                  ? "bisagra_izquierda"
                  : "bisagra_derecha",
            }
          : null,
      },
    },
  };
}

module.exports = calcularRajaModena;
