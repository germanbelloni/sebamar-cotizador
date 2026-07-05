const { fromRoot } = require("../../backend/utils/path");

const calcularPostigon = require(
  fromRoot("services/postigones/calcularPostigon"),
);

const buildWrapperResponse = require(
  fromRoot("backend/utils/buildWrapperResponse"),
);

const AuditBuilder = require(fromRoot("backend/audit/AuditBuilder"));

const perfiles = require(fromRoot("config/perfiles"));

const colores = require(fromRoot("backend/data/colores.json"));

const superficies = require(
  fromRoot("backend/data/productos/superficies.json"),
);

const dataJson = require(fromRoot("backend/data/productos/postigones.json"));

// =========================
// 🎨 COLOR
// =========================

function getColorFactor(color) {
  const c = colores.find(
    (x) => x.nombre.toLowerCase().trim() === (color || "").toLowerCase().trim(),
  );

  return c ? c.valor : 0;
}

// =========================
// 🔍 LOOKUP
// =========================

function buscarMedidaValida(medidas, ancho, alto) {
  const keys = Object.keys(medidas);

  const validas = keys
    .map((k) => {
      const [a, b] = k.split("x").map(Number);

      return {
        key: k,
        ancho: a,
        alto: b,
      };
    })
    .filter((m) => m.ancho >= ancho && m.alto >= alto)
    .sort((a, b) => a.ancho - b.ancho || a.alto - b.alto);

  return validas[0]?.key;
}

// =========================
// 💰 PERFIL
// =========================

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

// =========================
// 🧠 SVG
// =========================

function buildSVG({ tipo, hojas, apertura }) {
  return {
    tipo: "postigon",

    sistema: tipo,

    hojas,

    apertura: apertura || (tipo === "abrir" ? "derecha" : "lateral"),

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
  const audit = new AuditBuilder();
  let {
    medida,
    ancho,
    alto,
    tipo,
    hojas,
    marco,
    color = "blanco",
    extras = {},
    apertura,
    perfil = "amarilla",
    linea = "herrero",
  } = data;

  // =========================
  // 📏 PARSEO
  // =========================

  if (medida && medida !== "fuera_medida") {
    [ancho, alto] = medida.split("x").map(Number);
  }

  if (!ancho || !alto) {
    throw new Error("Faltan medidas");
  }

  // =========================
  // VALIDACIONES
  // =========================

  if (ancho < 60 || ancho > 240) {
    throw new Error("Ancho fuera de rango");
  }

  if (alto < 60 || alto > 210) {
    throw new Error("Alto fuera de rango");
  }

  const altoOriginal = alto;

  if (alto > 200) {
    alto = 200;
  }

  const medidaValida = buscarMedidaValida(dataJson.medidas, ancho, alto);

  audit.add({
    etapa: "Lookup",

    tipo: "lookup",

    origen: "postigones.json",

    referencia: medidaValida,

    metadata: {
      anchoSolicitado: ancho,
      altoSolicitado: altoOriginal,
      medidaUtilizada: medidaValida,
    },
  });

  if (!medidaValida) {
    throw new Error("No hay medida válida");
  }

  // =========================
  // 🧠 SERVICE
  // =========================

  const base = calcularPostigon({
    medida: medidaValida,
    tipo,
  });

  audit.add({
    etapa: "Costo Base",

    tipo: "base",

    origen: "postigones.json",

    valorAntes: 0,

    valorAplicado: base.costoBase,

    valorDespues: base.costoBase,

    metadata: {
      medida: medidaValida,
      tipo,
    },
  });

  // =========================
  // 🎨 COLOR
  // =========================

  const colorFactor = getColorFactor(color);

  const items = base.items.map((i) => {
    let precio = i.precio;

    // SOLO estructura lleva color
    if (i.tipo === "estructura") {
      precio *= 1 + colorFactor;
    }

    return {
      ...i,
      precio: Math.round(precio),
    };
  });

  // =========================
  // 💰 COSTO BASE
  // =========================

  let costoBase = items.reduce((acc, i) => acc + Number(i.precio || 0), 0);

  const estructuraOriginal =
    base.items.find((i) => i.tipo === "estructura")?.precio || 0;

  const estructuraColor =
    items.find((i) => i.tipo === "estructura")?.precio || 0;

  audit.add({
    etapa: "Color",

    tipo: "color",

    descripcion: `Recargo color ${color}`,

    origen: "colores.json",

    referencia: color,

    porcentaje: colorFactor,

    valorAntes: base.costoBase,

    valorAplicado: estructuraColor - estructuraOriginal,

    valorDespues: costoBase,

    metadata: {
      estructuraOriginal,
      estructuraColor,
      incremento: estructuraColor - estructuraOriginal,
      porcentajeColor: colorFactor,
    },
  });
  // =========================
  // 📏 ALTURA
  // =========================

  if (altoOriginal > 200 && altoOriginal <= 205) {
    costoBase *= 1.05;
  }

  if (altoOriginal > 205) {
    costoBase *= 1.1;
  }

  // =========================
  // ➕ EXTRAS
  // =========================

  if (extras.microperforado) {
    const extra = costoBase * 0.05;

    costoBase += extra;

    items.push({
      tipo: "extra",
      descripcion: "Microperforado",
      precio: Math.round(extra),
    });
  }

  if (extras.herrajeBlanco) {
    const mult = superficies.recargos?.herraje_blanco || 1.05;

    const extra = costoBase * (mult - 1);

    costoBase += extra;

    audit.add({
      etapa: "Extra",

      tipo: "microperforado",

      origen: "wrapper",

      valorAntes: costoBase - extra,

      valorAplicado: extra,

      valorDespues: costoBase,
    });
    items.push({
      tipo: "extra",
      descripcion: "Herraje blanco",
      precio: Math.round(extra),
    });

    audit.add({
      etapa: "Extra",

      tipo: "herraje_blanco",

      origen: "superficies.json",

      valorAntes: costoBase - extra,

      valorAplicado: extra,

      valorDespues: costoBase,

      porcentaje: mult - 1,
    });
  }

  // =========================
  // 🚪 HOJAS
  // =========================

  const hojasFinal = hojas || base.configuracion?.hojasBase || 2;

  // =========================
  // 💰 PERFIL
  // =========================

  const perfilData = perfiles[perfil]?.[linea] || perfiles["amarilla"][linea];

  const { costo, proveedor, venta } = aplicarPerfil(costoBase, perfilData);

  audit.add({
    etapa: "Perfil",

    tipo: "perfil",

    origen: "perfiles.js",

    referencia: perfil,

    valorAntes: costoBase,

    valorAplicado: venta - costoBase,

    valorDespues: venta,

    porcentaje: perfilData.ganancia,

    metadata: {
      descuento: perfilData.descuento,
      flete: perfilData.flete,
      ganancia: perfilData.ganancia,

      proveedor,
      venta,
    },
  });

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

    svg: buildSVG({
      tipo,

      hojas: hojasFinal,

      apertura,
    }),
  };
  return buildWrapperResponse({
    // IDENTIDAD
    modulo: "postigones",
    linea,

    // COSTOS
    costoBase,
    costo,

    // PRECIOS
    precioBase: costo,
    precioProveedor: proveedor,
    precioLista: venta,
    precioFinal: venta,

    // PERFIL
    perfilAplicado: perfil,
    descuentoAplicado: perfilData.descuento,
    fleteAplicado: perfilData.flete,
    gananciaAplicada: perfilData.ganancia,
    margenAplicado: Math.round(perfilData.ganancia * 100),

    // RESULTADO
    ganancia: venta - costo,

    items,

    descripcion: `Postigón ${tipo} ${ancho}x${altoOriginal}`,

    configuracion,

    audit: audit.getSteps(),
  });
}

module.exports = calcularWrapper;
