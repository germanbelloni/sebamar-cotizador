// wrappers/ventanas/calcularVentanaHerrero.js

const { fromRoot } = require("../../backend/utils/path");

const calcularVentana = require(
  fromRoot("backend/services/ventanas/calcularVentana"),
);

const perfiles = require(fromRoot("backend/config/perfiles"));

const superficies = require(
  fromRoot("backend/data/productos/superficies.json"),
);

const ventanas = require(
  fromRoot("backend/data/productos/ventanas_herrero.json"),
);

const colores = require(fromRoot("backend/data/colores.json"));

// 📐
const calcularM2 = (a, h) => (a * h) / 10000;

// 🔍 LOOKUP
function buscarMedidaValida(ancho, alto) {
  const medidas = Object.keys(ventanas.medidas);

  const anchos = [...new Set(medidas.map((m) => +m.split("x")[0]))].sort(
    (a, b) => a - b,
  );

  const altos = [...new Set(medidas.map((m) => +m.split("x")[1]))].sort(
    (a, b) => a - b,
  );

  const a = anchos.find((x) => x >= ancho);

  const h = altos.find((x) => x >= alto);

  if (!a || !h) {
    throw new Error("No hay medida válida");
  }

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
function calcularVentanaHerrero(dataInput) {
  const {
    ancho,
    alto,
    color = "blanco",
    guia,
    mosquitero,
    cortina,
    cajonBlock,
    perfil = "amarilla",
  } = dataInput;

  if (!ancho || !alto) {
    throw new Error("Faltan medidas");
  }

  // 🔥 REGLAS
  if (cajonBlock && guia) {
    throw new Error("No puede llevar guía y cajón block juntos");
  }

  if (!guia && cortina) {
    throw new Error("Sin guía no puede llevar cortina");
  }

  const medida = buscarMedidaValida(ancho, alto > 200 ? 200 : alto);

  const base = calcularVentana({
    medida,
    incluirGuia: guia,
    incluirMosquitero: mosquitero,
    linea: "herrero",
  });

  // 🎨 COLOR SOLO ESTRUCTURA
  const items = aplicarColor([...base.items], color);

  let costo = items.reduce((acc, i) => acc + Number(i.precio || 0), 0);

  const m2 = calcularM2(ancho, alto);

  // 🪟 CORTINA PVC
  if (cortina === "pvc") {
    const c = Number(superficies.cortinas?.pvc || 0) * m2;

    costo += c;

    items.push({
      tipo: "cortina_pvc",
      precio: Math.round(c),
    });
  }

  // 🪟 CORTINA ALUMINIO
  if (cortina === "aluminio") {
    const c = Number(superficies.cortinas?.aluminio?.blanco || 0) * m2;

    costo += c;

    items.push({
      tipo: "cortina_aluminio",
      precio: Math.round(c),
    });
  }

  // 📦 CAJON BLOCK
  let anchoFinal = ancho;
  let altoFinal = alto;

  if (cajonBlock) {
    anchoFinal += 8;
    altoFinal += 20;
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

    descripcion: `Ventana herrero ${ancho}x${alto}`,

    configuracion: {
      ancho,
      alto,
      anchoFinal,
      altoFinal,

      color,

      guia: !!guia,

      mosquitero: !!mosquitero,

      cortina: cortina || null,

      cajonBlock: !!cajonBlock,

      svg: {
        tipo: "ventana_herrero",
        hojas: ancho > 240 ? 2 : 1,
        mosquitero: !!mosquitero,
        guia: !!guia,
        cortina: cortina || null,
      },
    },
  };
}

module.exports = calcularVentanaHerrero;
