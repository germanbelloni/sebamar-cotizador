// wrappers/rajas/calcularRajaHerrero.js

const { fromRoot } = require("../../backend/utils/path");

const calcularRaja = require(fromRoot("backend/services/rajas/calcularRaja"));
const buildWrapperResponse = require(
  fromRoot("backend/utils/buildWrapperResponse"),
);
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
function buscarMedidaValida(ancho, alto) {
  const exacta = `${ancho}x${alto}`;

  if (data.medidas[exacta]) {
    return exacta;
  }

  const medidas = Object.keys(data.medidas).map((m) => {
    const [w, h] = m.split("x").map(Number);
    return { key: m, w, h };
  });

  const anchos = [...new Set(medidas.map((m) => m.w))].sort((a, b) => a - b);
  const altos = [...new Set(medidas.map((m) => m.h))].sort((a, b) => a - b);

  const maxAncho = anchos[anchos.length - 1];

  if (ancho > maxAncho) {
    throw new Error(
      `Ancho fuera de rango: ${ancho}cm (máximo permitido: ${maxAncho}cm)`,
    );
  }

  const anchoSuperior =
    anchos.find((w) => w >= ancho) || anchos[anchos.length - 1];

  const altoSuperior = altos.find((h) => h >= alto) || altos[altos.length - 1];

  let medidaFinal = `${anchoSuperior}x${altoSuperior}`;

  if (!data.medidas[medidaFinal]) {
    const fallback = medidas.find(
      (m) => m.w >= anchoSuperior && m.h >= altoSuperior,
    );

    if (!fallback) {
      throw new Error(`No existe medida válida para ${ancho}x${alto}`);
    }

    medidaFinal = fallback.key;
  }

  console.log(`⚠️ Fuera de medida: ${ancho}x${alto} → usando ${medidaFinal}`);

  return medidaFinal;
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
function calcularRajaHerrero(dataInput) {
  console.log("RAJA INPUT:");
  console.log(JSON.stringify(dataInput, null, 2));
  const ancho = dataInput.ancho ?? dataInput.configuracion?.ancho;

  const alto = dataInput.alto ?? dataInput.configuracion?.alto;

  const color = dataInput.color ?? dataInput.configuracion?.color ?? "blanco";

  const vidrio = dataInput.vidrio ?? dataInput.configuracion?.vidrio;

  const tipoVidrio =
    dataInput.tipoVidrio ?? dataInput.configuracion?.tipoVidrio;

  const mosquitero =
    dataInput.mosquitero ?? dataInput.configuracion?.mosquitero;

  const modelo = dataInput.modelo ?? dataInput.configuracion?.modelo ?? "raja";

  const desague = dataInput.desague ?? dataInput.configuracion?.desague;

  const bisagra = dataInput.bisagra ?? dataInput.configuracion?.bisagra;

  const premarco = dataInput.premarco ?? dataInput.configuracion?.premarco;

  const contramarco =
    dataInput.contramarco ?? dataInput.configuracion?.contramarco;

  const perfil = dataInput.perfil || "amarilla";

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

  return buildWrapperResponse({
    costoBase: base.costoBase,

    costo,

    proveedor,

    venta,

    perfil,

    perfilData,

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
  });
}

module.exports = calcularRajaHerrero;
