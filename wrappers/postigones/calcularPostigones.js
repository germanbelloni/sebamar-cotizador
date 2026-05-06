const { fromRoot } = require("../../backend/utils/path");

const calcularPostigon = require(
  fromRoot("services/postigones/calcularPostigon"),
);

const perfiles = require(fromRoot("config/perfiles"));
const colores = require(fromRoot("frontend/data/colores.json"));
const superficies = require(
  fromRoot("frontend/data/productos/superficies.json"),
);
const dataJson = require(fromRoot("frontend/data/productos/postigones.json"));

// 🎨 COLOR
function getColorFactor(color) {
  const c = colores.find(
    (x) => x.nombre.toLowerCase().trim() === (color || "").toLowerCase().trim(),
  );
  return c ? c.valor : 0;
}

// 🔍 LOOKUP
function buscarMedidaValida(medidas, ancho, alto) {
  const keys = Object.keys(medidas);

  const validas = keys
    .map((k) => {
      const [a, b] = k.split("x").map(Number);
      return { key: k, ancho: a, alto: b };
    })
    .filter((m) => m.ancho >= ancho && m.alto >= alto)
    .sort((a, b) => a.ancho - b.ancho || a.alto - b.alto);

  return validas[0]?.key;
}

// 💰 PERFIL
function aplicarPerfil(costo, p) {
  const costoDesc = costo * (1 - p.descuento);
  const proveedor = costoDesc * (1 + p.flete);
  const venta = proveedor * (1 + p.ganancia);

  return {
    costo: costoDesc,
    proveedor,
    venta,
  };
}

// 🎯 SVG BUILDER (🔥 IMPORTANTE)
function buildSVG({ tipo, hojas, apertura }) {
  return {
    tipo: "postigon",
    sistema: tipo, // abrir / corredizo
    hojas,

    // 👉 cómo abre visto desde adentro
    apertura: apertura || (tipo === "abrir" ? "derecha" : "lateral"),

    // 👉 keys para frontend
    svgKey: `${tipo}_${hojas}_hojas`,

    detalle:
      tipo === "abrir"
        ? {
            orientacion: apertura || "derecha",
          }
        : {
            direccion: apertura || "izq_der",
          },
  };
}

// =========================
// 🚀 WRAPPER
// =========================
function calcularWrapper(data) {
  let {
    medida,
    ancho,
    alto,
    tipo,
    hojas,
    marco,
    color,
    extras = {},
    apertura, // 🔥 NUEVO
    perfil = "amarilla",
    linea = "herrero",
  } = data;

  // 📏 PARSEO
  if (medida && medida !== "fuera_medida") {
    [ancho, alto] = medida.split("x").map(Number);
  }

  if (!ancho || !alto) throw new Error("Faltan medidas");

  // VALIDACIONES
  if (ancho < 60 || ancho > 240) {
    throw new Error("Ancho fuera de rango");
  }

  if (alto < 60 || alto > 210) {
    throw new Error("Alto fuera de rango");
  }

  const altoOriginal = alto;

  if (alto > 200) alto = 200;

  const medidaValida = buscarMedidaValida(dataJson.medidas, ancho, alto);

  if (!medidaValida) throw new Error("No hay medida válida");

  // =========================
  // 🧠 SERVICE
  // =========================
  const base = calcularPostigon({
    medida: medidaValida,
    tipo,
  });

  let costoBase = base.costoBase;
  let items = [...(base.items || [])];

  // =========================
  // 🎨 COLOR (solo base)
  // =========================
  const colorFactor = getColorFactor(color);
  const costoColor = costoBase * colorFactor;

  if (costoColor > 0) {
    items.push({
      tipo: "color",
      descripcion: color,
      precio: Math.round(costoColor),
    });
  }

  let costoConExtras = costoBase + costoColor;

  // =========================
  // 📏 ALTURA
  // =========================
  if (altoOriginal > 200 && altoOriginal <= 205) {
    costoConExtras *= 1.05;
  }

  if (altoOriginal > 205) {
    costoConExtras *= 1.1;
  }

  // =========================
  // ➕ EXTRAS
  // =========================
  if (extras.microperforado) {
    const extra = costoBase * 0.05;
    costoConExtras += extra;

    items.push({
      tipo: "extra",
      descripcion: "Microperforado",
      precio: Math.round(extra),
    });
  }

  if (extras.herrajeBlanco) {
    const mult = superficies.recargos?.herraje_blanco || 1.05;
    const extra = costoBase * (mult - 1);
    costoConExtras += extra;

    items.push({
      tipo: "extra",
      descripcion: "Herraje blanco",
      precio: Math.round(extra),
    });
  }

  // =========================
  // 🚪 HOJAS (solo informativo)
  // =========================
  const hojasFinal = hojas || base.configuracion?.hojasBase || 2;

  // =========================
  // 💰 PERFIL
  // =========================
  const perfilData = perfiles[perfil]?.[linea] || perfiles["amarilla"][linea];

  const { costo, proveedor, venta } = aplicarPerfil(costoConExtras, perfilData);

  // =========================
  // 🧠 CONFIG
  // =========================
  const configuracion = {
    ancho,
    alto: altoOriginal,
    medidaUsada: medidaValida,
    tipo,
    hojas: hojasFinal,
    hojasBase: base.configuracion?.hojasBase,
    color,
    marco,
    extras,
    apertura,

    // 🔥 SVG
    svg: buildSVG({
      tipo,
      hojas: hojasFinal,
      apertura,
    }),
  };

  return {
    costoBase: Math.round(costoBase),
    costo: Math.round(costo),
    precioProveedor: Math.round(proveedor),
    precioVenta: Math.round(venta),
    ganancia: Math.round(venta - costo),

    items,

    descripcion: `Postigón ${tipo} ${ancho}x${altoOriginal}`,

    configuracion,
  };
}

module.exports = calcularWrapper;
