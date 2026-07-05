const { fromRoot } = require("../../backend/utils/path");

const AuditBuilder = require(fromRoot("backend/audit/AuditBuilder"));

const buildWrapperResponse = require(
  fromRoot("backend/utils/buildWrapperResponse"),
);

const calcularPatagonica = require(
  fromRoot("backend/services/patagonicas/calcularPatagonicaModena"),
);

const perfiles = require(fromRoot("backend/config/perfiles"));

const colores = require(fromRoot("backend/data/colores.json"));

const superficies = require(
  fromRoot("backend/data/productos/superficies.json"),
);

const { buildPatagonicaSVG } = require(fromRoot("backend/utils/svg"));
function aplicarPerfil(costo, p) {
  const proveedor = costo * (1 - p.descuento);

  const venta = proveedor * (1 + p.flete) * (1 + p.ganancia);

  return {
    proveedor,
    venta,
  };
}

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

    return {
      ...item,
      precio: Math.round(item.precio * (1 + porcentaje)),
    };
  });
}

// =========================
// 🚀 WRAPPER
// =========================

function calcularWrapper(dataInput) {
  const audit = new AuditBuilder();

  let {
    medida,

    ancho,
    alto,

    cantidadRajas = 1,

    tipoVidrio = "4mm",

    tipoRaja = "raja",

    color = "blanco",

    perfil = "amarilla",

    ladoApertura = "derecha",

    tipoApertura = "abrir",

    herrajesBlancos = false,
  } = dataInput;

  // =========================
  // 📏 NORMALIZAR
  // =========================

  if (medida) {
    const partes = medida.split("x").map(Number);

    ancho = partes[0];
    alto = partes[1];
  }

  if (!ancho || !alto) {
    throw new Error("Faltan medidas");
  }

  const medidaFinal = `${ancho}x${alto}`;

  audit.add({
    etapa: "Lookup",

    tipo: "lookup",

    origen: "wrapper",

    referencia: medidaFinal,

    valorAntes: 0,

    valorAplicado: 0,

    valorDespues: 0,

    metadata: {
      anchoSolicitado: ancho,
      altoSolicitado: alto,
      medidaUtilizada: medidaFinal,
      cantidadRajas,
    },
  });
  // =========================
  // 🔧 TIPO
  // =========================

  const tipo = cantidadRajas === 2 ? "2_rajas" : "1_raja";

  // =========================
  // 🧠 SERVICE
  // =========================

  const base = calcularPatagonica({
    tipo,

    medida: medidaFinal,

    tipoVidrio,
  });

  // =========================
  // 🎨 COLOR
  // =========================

  const items = aplicarColor([...base.items], color);

  let costo = items.reduce((acc, i) => acc + Number(i.precio || 0), 0);

  const estructuraOriginal =
    base.items.find((i) => i.tipo === "estructura")?.precio || 0;

  const estructuraColor =
    items.find((i) => i.tipo === "estructura")?.precio || 0;

  const vidrio = items.find((i) => i.tipo === "vidrio")?.precio || 0;

  const porcentajeColor = Number(
    colores.find((c) => c.nombre === color)?.valor || 0,
  );

  audit.add({
    etapa: "Color",

    tipo: "color",

    descripcion: `Recargo color ${color}`,

    origen: "colores.json",

    referencia: color,

    valorAntes: base.costoBase,

    valorAplicado: costo - base.costoBase,

    valorDespues: costo,

    porcentaje: porcentajeColor,

    metadata: {
      estructuraOriginal,
      estructuraColor,
      vidrio,
      porcentajeColor,
      incremento: costo - base.costoBase,
      costoBase: base.costoBase,
    },
  });

  // =========================
  // 🔧 BRAZO
  // =========================

  if (tipoRaja === "brazo") {
    const extra = Number(superficies.extras["brazo_de_empuje"] || 0);

    costo += extra;

    items.push({
      tipo: "brazo",
      precio: Math.round(extra),
    });

    audit.add({
      etapa: "Brazo",

      tipo: "extra",

      origen: "superficies.json",

      referencia: "brazo_de_empuje",

      valorAntes: costo - extra,

      valorAplicado: extra,

      valorDespues: costo,

      metadata: {},
    });
  }

  // =========================
  // 🔧 VOLCABLE
  // =========================

  if (tipoRaja === "volcable") {
    const extra = Number(superficies.extras.volcable || 0);

    costo += extra;

    items.push({
      tipo: "volcable",
      precio: Math.round(extra),
    });

    audit.add({
      etapa: "Volcable",

      tipo: "extra",

      origen: "superficies.json",

      referencia: "volcable",

      valorAntes: costo - extra,

      valorAplicado: extra,

      valorDespues: costo,

      metadata: {},
    });
  }

  // =========================
  // 🔧 OSCILOBATIENTE
  // =========================

  if (tipoRaja === "oscilobatiente") {
    const extra = Number(superficies.extras.oscilobatiente || 0);

    costo += extra;

    items.push({
      tipo: "oscilobatiente",
      precio: Math.round(extra),
    });

    audit.add({
      etapa: "Oscilobatiente",

      tipo: "extra",

      origen: "superficies.json",

      referencia: "oscilobatiente",

      valorAntes: costo - extra,

      valorAplicado: extra,

      valorDespues: costo,

      metadata: {},
    });
  }

  // =========================
  // ⚪ HERRAJES BLANCOS
  // =========================

  if (herrajesBlancos) {
    const estructura = items.find((i) => i.tipo === "estructura");

    if (estructura) {
      const mult = Number(superficies.recargos?.herraje_blanco || 1.05);

      const extra = Math.round(estructura.precio * (mult - 1));

      costo += extra;

      items.push({
        tipo: "extra",
        descripcion: "Herrajes blancos",
        precio: extra,
      });

      audit.add({
        etapa: "Herrajes Blancos",

        tipo: "extra",

        origen: "superficies.json",

        referencia: "herraje_blanco",

        valorAntes: costo - extra,

        valorAplicado: extra,

        valorDespues: costo,

        metadata: {},
      });
    }
  }

  // 👇 ESTA LÍNEA FALTABA
  const costoBase = costo;

  audit.add({
    etapa: "Costo Base",

    tipo: "base",

    origen: "patagonicas_modena.json",

    referencia: "",

    valorAntes: 0,

    valorAplicado: costoBase,

    valorDespues: costoBase,

    metadata: {
      medida: medidaFinal,
      tipo,
    },
  });

  // =========================
  // 💰 PERFIL
  // =========================

  const perfilData = perfiles[perfil]?.modena || perfiles.amarilla.modena;

  const { proveedor, venta } = aplicarPerfil(costo, perfilData);
  audit.add({
    etapa: "Perfil",

    tipo: "perfil",

    origen: "perfiles.js",

    referencia: perfil,

    valorAntes: costo,

    valorAplicado: venta - costo,

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

    alto,

    medida: medidaFinal,

    cantidadRajas,

    tipo,

    tipoRaja,

    color,

    tipoVidrio,

    herrajesBlancos,

    svg: buildPatagonicaSVG({
      cantidadRajas,

      ladoApertura,

      tipoApertura,
    }),
  };

  // =========================
  // ✅ RESPONSE
  // =========================

  return buildWrapperResponse({
    // =========================
    // IDENTIDAD
    // =========================

    modulo: "patagonicas",

    linea: "modena",

    // =========================
    // COSTOS
    // =========================

    costoBase,

    costo: costoBase,

    // =========================
    // PRECIOS
    // =========================

    precioBase: costo,

    precioProveedor: proveedor,

    precioLista: venta,

    precioFinal: venta,

    // =========================
    // PERFIL
    // =========================

    perfilAplicado: perfil,

    descuentoAplicado: perfilData.descuento,

    fleteAplicado: perfilData.flete,

    gananciaAplicada: perfilData.ganancia,

    margenAplicado: 0,

    // =========================
    // RESULTADO
    // =========================

    ganancia: venta - costo,

    descripcion: `Patagónica Modena ${medidaFinal}`,

    items,

    configuracion,

    audit: audit.getSteps(),
  });
}

module.exports = calcularWrapper;
