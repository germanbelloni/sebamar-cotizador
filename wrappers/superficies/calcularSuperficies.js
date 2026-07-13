const { fromRoot } = require("../../backend/utils/path");

const calcularSuperficie = require(
  fromRoot("services/superficies/superficies"),
);

const buildWrapperResponse = require(
  fromRoot("backend/utils/buildWrapperResponse"),
);

const AuditBuilder = require(fromRoot("backend/audit/AuditBuilder"));

const perfiles = require(fromRoot("config/perfiles"));

const colores = require(fromRoot("backend/data/colores.json"));

// ========================
// 🎨 COLOR
// ========================

function getColorFactor(color) {
  const c = colores.find(
    (x) => x.nombre.toLowerCase().trim() === (color || "").toLowerCase().trim(),
  );

  return c ? c.valor : 0;
}

// ========================
// 🚀 WRAPPER
// ========================

function calcularsuperficiesWrapper(dataInput) {
  const audit = new AuditBuilder();
  const {
    tipo,
    ancho,
    alto,
    linea = "herrero",
    color = "blanco",
    tipoVidrio,
    perfil = "amarilla",
    premarco = false,
    contramarco = false,
    travesanoVertical = false,
    travesanoHorizontal = false,
  } = dataInput;

  if (!tipo || !ancho || !alto) {
    throw new Error("Faltan datos");
  }

  // ========================
  // 🧠 SERVICE
  // ========================

  const resultado = calcularSuperficie({
    tipo,
    ancho,
    alto,
    linea,
    tipoVidrio,
    premarco,
    contramarco,
    travesanoVertical,
    travesanoHorizontal,
  });

  audit.add({
    etapa: "Lookup",
    tipo: "lookup",
    origen: "superficies.json",
    referencia: tipo,
    metadata: {
      ancho,
      alto,
      linea,
      tipoVidrio,
    },
  });

  const items = [...resultado.items];

  const estructuraOriginal =
    items.find((i) => i.tipo === "estructura")?.precio || 0;

  const vidrio = items.find((i) => i.tipo === "vidrio")?.precio || 0;

  audit.add({
    etapa: "Estructura",
    tipo: "estructura",
    origen: "superficies.json",

    valorAntes: 0,
    valorAplicado: estructuraOriginal,
    valorDespues: estructuraOriginal,
  });

  if (vidrio > 0) {
    audit.add({
      etapa: "Vidrio",
      tipo: "vidrio",
      origen: "superficies.json",

      valorAntes: estructuraOriginal,
      valorAplicado: vidrio,
      valorDespues: estructuraOriginal + vidrio,

      referencia: tipoVidrio,
    });
  }

  // ========================
  // 🎨 COLOR
  // SOLO ESTRUCTURA
  // ========================

  const colorFactor = getColorFactor(color);

  if (colorFactor > 0) {
    const estructura = items.find((i) => i.tipo === "estructura");

    if (estructura) {
      const original = estructura.precio;

      estructura.precio = Math.round(original * (1 + colorFactor));

      audit.add({
        etapa: "Color",

        tipo: "color",

        descripcion: `Recargo color ${color}`,

        origen: "colores.json",

        referencia: color,

        porcentaje: colorFactor,

        valorAntes: resultado.costoBase,

        valorAplicado: estructura.precio - original,

        valorDespues: resultado.items
          .filter((i) => i.tipo !== "estructura")
          .reduce((a, i) => a + Number(i.precio || 0), estructura.precio),

        metadata: {
          estructuraOriginal: original,
          estructuraColor: estructura.precio,
        },
      });
    }
  }

  const costoBase = items.reduce(
    (acc, item) => acc + Number(item.precio || 0),
    0,
  );

  audit.add({
    etapa: "Costo Base",
    tipo: "base",
    origen: "superficies.json",

    valorAntes: 0,
    valorAplicado: costoBase,
    valorDespues: costoBase,

    metadata: {
      tipo,
      ancho,
      alto,
    },
  });

  // ========================
  // 💰 PERFIL
  // ========================

  let perfilLinea = linea;

  if (tipo === "premarco" || tipo === "contramarco") {
    perfilLinea = "premarcos";
  }

  const perfilData = perfiles[perfil]?.[perfilLinea];

  if (!perfilData) {
    throw new Error(`Perfil inválido: ${perfil} - ${linea}`);
  }

  const costoFinal = costoBase * (1 - perfilData.descuento);

  const proveedor = costoFinal * (1 + perfilData.flete);

  const venta = proveedor * (1 + perfilData.ganancia);

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
  // ========================
  // 🧾 DESCRIPCIÓN
  // ========================

  let descripcion = "";

  if (tipo === "pano_fijo") {
    descripcion = `Paño fijo ${linea} ${ancho}x${alto}`;

    if (tipoVidrio) {
      descripcion += ` vidrio ${tipoVidrio}`;
    }

    if (premarco) {
      descripcion += " c/premarco";
    }

    if (contramarco) {
      descripcion += " c/contramarco";
    }

    if (color !== "blanco") {
      descripcion += ` ${color}`;
    }
  }

  if (tipo === "premarco") {
    descripcion = `Premarco ${ancho}x${alto}`;
  }

  if (tipo === "contramarco") {
    descripcion = `Contramarco ${ancho}x${alto}`;

    if (color !== "blanco") {
      descripcion += ` ${color}`;
    }
  }
  // ========================
  // 🧠 CONFIG
  // ========================

  const configuracion = {
    tipo,
    ancho,
    alto,
  };

  if (tipo === "pano_fijo") {
    configuracion.linea = linea;
    configuracion.color = color;
    configuracion.tipoVidrio = tipoVidrio;
    configuracion.premarco = premarco;
    configuracion.contramarco = contramarco;
    configuracion.travesanoVertical = travesanoVertical;
    configuracion.travesanoHorizontal = travesanoHorizontal;
  }

  if (tipo === "contramarco") {
    configuracion.color = color;
  }

  // ========================
  // ✅ RESPONSE
  // ========================

  return buildWrapperResponse({
    modulo: "superficies",

    linea,

    costoBase,

    costo: costoFinal,

    precioBase: costoFinal,

    precioProveedor: proveedor,

    precioLista: venta,

    precioFinal: venta,

    perfilAplicado: perfil,

    descuentoAplicado: perfilData.descuento,

    fleteAplicado: perfilData.flete,

    gananciaAplicada: perfilData.ganancia,

    margenAplicado: 0,

    ganancia: venta - costoFinal,

    items,

    descripcion,

    configuracion,

    audit: audit.getSteps(),
  });
}

module.exports = calcularsuperficiesWrapper;
