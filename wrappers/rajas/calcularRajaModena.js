const { fromRoot } = require("../../backend/utils/path");

const calcularRaja = require(fromRoot("backend/services/rajas/calcularRaja"));

const superficies = require(
  fromRoot("frontend/data/productos/superficies.json"),
);

const perfiles = require(fromRoot("backend/config/perfiles"));
const colores = require(fromRoot("frontend/data/colores.json"));
const data = require(fromRoot("frontend/data/productos/rajas_modena.json"));

// 📐
const calcularM2 = (a, h) => (a * h) / 10000;
const calcularML = (a, h) => (a * 2 + h * 2) / 100;

// 🎨
function getColorValor(color) {
  const c = colores.find(
    (x) => x.nombre.toLowerCase().trim() === (color || "").toLowerCase().trim(),
  );
  return c ? c.valor : 0;
}

// 🔍
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

  return { proveedor, venta };
}

// 🚀 MAIN
function calcularRajaModena(dataInput) {
  const {
    ancho,
    alto,
    vidrio,
    color,
    mosquitero,
    herrajesBlancos,
    modelo = "raja",
    premarco,
    contramarco,
    perfil = "amarilla",
    bisagra,
  } = dataInput;

  const medida = buscarMedidaValida(ancho, alto);

  const base = calcularRaja({
    medida,
    tipoVidrio: vidrio || "4mm",
    color,
    linea: "modena",
  });

  let costo = base.costoBase;
  let items = [];

  items.push({
    tipo: "base",
    descripcion: medida,
    precio: Math.round(base.costoBase),
  });

  const m2 = calcularM2(ancho, alto);
  const ml = calcularML(ancho, alto);

  // 🧵 MOSQUITERO
  if (mosquitero) {
    const c = superficies.superficies.mosquitero_fijo * m2;
    costo += c;

    items.push({
      tipo: "mosquitero",
      precio: Math.round(c),
    });
  }

  // 🔧 MODELO
  if (modelo === "oscilobatiente") {
    const c = superficies.extras.oscilobatiente || 0;
    costo += c;

    items.push({
      tipo: "oscilobatiente",
      precio: c,
    });
  }

  // 🪚 PREMARCO / CONTRAMARCO
  if (premarco) {
    const c = superficies.superficies.premarco * ml;
    costo += c;

    items.push({ tipo: "premarco", precio: Math.round(c) });
  }

  if (premarco || contramarco) {
    const baseC = superficies.superficies.contramarco * ml;
    const c = baseC * (1 + getColorValor(color));

    costo += c;

    items.push({ tipo: "contramarco", precio: Math.round(c) });
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
      vidrio,
      mosquitero,
      modelo,
      premarco,
      contramarco,

      // 🔥 SVG READY
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
