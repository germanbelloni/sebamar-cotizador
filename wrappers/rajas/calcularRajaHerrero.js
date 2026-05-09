// wrappers/rajas/calcularRajaHerrero.js

const { fromRoot } = require("../../backend/utils/path");

const calcularRaja = require(fromRoot("backend/services/rajas/calcularRaja"));

const superficies = require(
  fromRoot("backend/data/productos/superficies.json"),
);

const perfiles = require(fromRoot("backend/config/perfiles"));

const colores = require(fromRoot("backend/data/colores.json"));

const data = require(fromRoot("backend/data/productos/rajas_herrero.json"));

// 📐
const calcularM2 = (a, h) => (a * h) / 10000;

function normalizarAlto(alto) {
  if (alto > 150) {
    return 150;
  }

  return alto;
}

// 🔍 LOOKUP
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

// 🚀 MAIN
function calcularRajaHerrero(dataInput) {
  const {
    ancho,
    alto,
    color = "blanco",
    vidrio,
    tipoVidrio,
    mosquitero,
    modelo = "raja",
    desague,
    bisagra,
    premarco,
    contramarco,
    perfil = "amarilla",
  } = dataInput;

  if (!ancho || !alto) {
    throw new Error("Faltan medidas");
  }

  const medida = buscarMedidaValida(ancho, normalizarAlto(alto));

  const vidrioFinal = tipoVidrio || vidrio || "4mm";

  const base = calcularRaja({
    medida,
    tipoVidrio: vidrioFinal,
    linea: "herrero",
  });

  // 🎨 COLOR SOLO ESTRUCTURA
  const items = aplicarColor([...base.items], color);

  let costo = items.reduce((acc, i) => acc + Number(i.precio || 0), 0);

  const m2 = calcularM2(ancho, alto);

  // 🧵 MOSQUITERO
  if (mosquitero) {
    const c = Number(superficies.superficies.mosquitero_fijo || 0) * m2;

    costo += c;

    items.push({
      tipo: "mosquitero",
      precio: Math.round(c),
    });
  }

  // 🔧 MODELO
  if (modelo === "brazo" || modelo === "volcable") {
    costo += 4000;

    items.push({
      tipo: "modelo",
      descripcion: modelo,
      precio: 4000,
    });
  }

  // 📏 ALTURA
  if (alto > 150) {
    costo *= 1.3;
  }

  // 💰 PERFIL
  const perfilData = perfiles[perfil]?.herrero || perfiles.amarilla.herrero;

  const { proveedor, venta } = aplicarPerfil(costo, perfilData);

  return {
    costoBase: Math.round(base.costoBase),

    costo: Math.round(costo),

    precioProveedor: Math.round(proveedor),

    precioVenta: Math.round(venta),

    ganancia: Math.round(venta - costo),

    items,

    descripcion: `Raja Herrero ${ancho}x${alto}`,

    configuracion: {
      ancho,
      alto,

      medidaUsada: medida,

      color,

      vidrio: vidrioFinal,

      mosquitero: !!mosquitero,

      modelo,

      desague,

      bisagra,

      premarco: !!premarco,

      contramarco: !!contramarco,

      svg: {
        tipo: "raja",
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

module.exports = calcularRajaHerrero;
