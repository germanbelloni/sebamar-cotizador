const { fromRoot } = require("../../backend/utils/path");

const calcularRaja = require(fromRoot("backend/services/rajas/calcularRaja"));

const superficies = require(
  fromRoot("frontend/data/productos/superficies.json"),
);

const perfiles = require(fromRoot("backend/config/perfiles"));
const data = require(fromRoot("frontend/data/productos/rajas_herrero.json"));

// 📐
const calcularM2 = (a, h) => (a * h) / 10000;

function normalizarAlto(alto) {
  if (alto > 150) return 150;
  return alto;
}

// 🔍 LOOKUP
function buscarMedidaValida(ancho, alto) {
  const medidas = Object.keys(data.medidas);

  const anchos = [...new Set(medidas.map((m) => +m.split("x")[0]))].sort(
    (a, b) => a - b,
  );
  const altos = [...new Set(medidas.map((m) => +m.split("x")[1]))].sort(
    (a, b) => a - b,
  );

  const a = anchos.find((x) => x >= ancho);
  const h = altos.find((x) => x >= alto);

  if (!a || !h) throw new Error("No hay medida válida");

  return `${a}x${h}`;
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

// 🚀 MAIN
function calcularRajaHerrero(dataInput) {
  const {
    ancho,
    alto,
    color,
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

  if (!ancho || !alto) throw new Error("Faltan medidas");

  const medida = buscarMedidaValida(ancho, normalizarAlto(alto));

  const vidrioFinal = tipoVidrio || vidrio || "4mm";

  const base = calcularRaja({
    medida,
    tipoVidrio: vidrioFinal,
    color,
    linea: "herrero",
  });

  let costo = base.costoBase;
  let items = [];

  items.push({
    tipo: "base",
    descripcion: medida,
    precio: Math.round(base.costoBase),
  });

  const m2 = calcularM2(ancho, alto);

  // 🧵 MOSQUITERO
  if (mosquitero) {
    const c = (superficies.superficies.mosquitero_fijo || 0) * m2;
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

      // 🔥 SVG READY
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
