const { fromRoot } = require("../../backend/utils/path");

const calcularRajaHerrero = require(
  fromRoot("wrappers/rajas/calcularRajaHerrero"),
);

const buildWrapperResponse = require(
  fromRoot("backend/utils/buildWrapperResponse"),
);

const AuditBuilder = require(fromRoot("backend/audit/AuditBuilder"));

const calcularSuperficie = require(
  fromRoot("wrappers/superficies/calcularSuperficies"),
);

const perfiles = require(fromRoot("config/perfiles"));

const superficies = require(
  fromRoot("backend/data/productos/superficies.json"),
);

const calcularPrecioCortina = require(
  fromRoot("backend/services/cortinas/calcularPrecioCortina"),
);

const { buildPatagonicaSVG } = require(fromRoot("utils/svg"));

// =========================
// 🚀 WRAPPER
// =========================

function calcularWrapper(data) {
  const audit = new AuditBuilder();
  const {
    medidaTotal,

    tipo,

    color = "blanco",

    guia = false,

    cajonBlock = false,

    cortina = null,

    tipoRaja = "raja",

    perfil = "amarilla",

    ladoApertura = "derecha",

    tipoApertura = "abrir",

    anchoRaja = 40,

    tipoVidrio = "4mm",

    linea = "Herrero",
  } = data;

  // =========================
  // 🧠 NORMALIZAR
  // =========================

  const lineaNormalizada = String(linea).toLowerCase();

  // =========================
  // 📏 VALIDAR
  // =========================

  if (!medidaTotal) {
    throw new Error("Falta medida");
  }

  const [ancho, alto] = medidaTotal.split("x").map(Number);

  if (!ancho || !alto) {
    throw new Error("Medida inválida");
  }

  // =========================
  // ⚙️ CONFIG
  // =========================

  const cantidadRajas = tipo === "2_rajas" ? 2 : 1;

  const anchoRajaFinal = Number(anchoRaja);

  const anchoTotalRajas = anchoRajaFinal * cantidadRajas;

  const anchoFijo = ancho - anchoTotalRajas;

  if (anchoFijo <= 0 || isNaN(anchoFijo)) {
    throw new Error("Ancho fijo inválido");
  }

  audit.add({
    etapa: "Lookup",

    tipo: "lookup",

    origen: "wrapper",

    referencia: medidaTotal,

    metadata: {
      medidaSolicitada: medidaTotal,

      ancho,

      alto,

      cantidadRajas,

      anchoRaja: anchoRajaFinal,

      anchoFijo,

      linea: lineaNormalizada,
    },
  });

  // =========================
  // 🪟 RAJAS
  // =========================

  let totalRajas = 0;

  const items = [];
  let extras = 0;

  for (let i = 0; i < cantidadRajas; i++) {
    const raja = calcularRajaHerrero({
      ancho: anchoRajaFinal,
      alto: Number(alto),
      color,
      tipoVidrio,
      modelo: tipoRaja,
    });

    const costoRaja = Number(raja?.costo || 0);

    totalRajas += costoRaja;

    items.push({
      tipo: "raja",
      precio: Math.round(costoRaja),
    });

    audit.add({
      etapa: `Raja ${i + 1}`,

      tipo: "componente",

      origen: "calcularRajaHerrero",

      referencia: `${anchoRajaFinal}x${alto}`,

      valorAntes: totalRajas - costoRaja,

      valorAplicado: costoRaja,

      valorDespues: totalRajas,

      metadata: {
        ancho: anchoRajaFinal,

        alto,

        modelo: tipoRaja,
      },
    });
  }

  // =========================
  // 🪟 PAÑO FIJO
  // =========================

  let fijo = {
    costoBase: 0,
    items: [],
  };

  try {
    fijo = calcularSuperficie({
      tipo: "pano_fijo",

      ancho: Number(anchoFijo),

      alto: Number(alto),

      linea: lineaNormalizada,

      color,

      tipoVidrio,

      perfil,
    });
    const costoFijo = Number(fijo?.costoBase || 0);

    items.push({
      tipo: "pano_fijo",
      precio: Math.round(costoFijo),
    });

    audit.add({
      etapa: "Paño Fijo",

      tipo: "componente",

      origen: "calcularSuperficies",

      referencia: `${anchoFijo}x${alto}`,

      valorAntes: totalRajas,

      valorAplicado: costoFijo,

      valorDespues: totalRajas + costoFijo,

      metadata: {
        ancho: anchoFijo,

        alto,

        tipo: "pano_fijo",

        linea: lineaNormalizada,
      },
    });
  } catch (err) {
    console.error("ERROR SUPERFICIE:", err);
  }

  // =========================
  // 🔗 ACOPLE
  // =========================

  let acople = {
    costoBase: 0,
    items: [],
  };

  try {
    acople = calcularSuperficie({
      tipo: "perfil_acople",
      ancho: 1,
      alto: Number(alto),
      linea: lineaNormalizada,
      color,
      perfil,
    });

    const costoAcople = Number(acople?.costoBase || 0);

    items.push({
      tipo: "perfil_acople",
      precio: Math.round(costoAcople),
    });

    audit.add({
      etapa: "Perfil Acople",

      tipo: "componente",

      origen: "calcularSuperficies",

      referencia: `${alto}`,

      valorAntes: totalRajas + Number(fijo?.costoBase || 0),

      valorAplicado: costoAcople,

      valorDespues: totalRajas + Number(fijo?.costoBase || 0) + costoAcople,

      metadata: {
        alto,
      },
    });
  } catch (err) {
    console.error("ERROR ACOPLE:", err);
  }

  // 🪟 CORTINA PVC
  if (guia && cortina === "pvc") {
    const resultadoCortina = calcularPrecioCortina({
      tipo: "cortina",
      material: "pvc",
      calidad: "reforzada",
      construccion: "completa",
      ancho,
      alto,
    });

    const c = resultadoCortina.costoBase;

    totalRajas += c;

    items.push({
      tipo: "cortina_pvc",
      precio: c,
    });

    audit.add({
      etapa: "Cortina PVC",
      tipo: "extra",
      origen: "calcularPrecioCortina",
      valorAntes: totalRajas - c,
      valorAplicado: c,
      valorDespues: totalRajas,
    });
  }

  // 🪟 CORTINA ALUMINIO
  if (guia && cortina === "aluminio") {
    const resultadoCortina = calcularPrecioCortina({
      tipo: "cortina",
      material: "aluminio",
      construccion: "completa",
      color: color === "simil_madera" ? "simil_madera" : "blanco",
      ancho,
      alto,
    });

    const c = resultadoCortina.costoBase;

    totalRajas += c;

    items.push({
      tipo: "cortina_aluminio",
      precio: c,
    });

    audit.add({
      etapa: "Cortina Aluminio",
      tipo: "extra",
      origen: "calcularPrecioCortina",
      valorAntes: totalRajas - c,
      valorAplicado: c,
      valorDespues: totalRajas,
    });
  }
  // 📦 CAJÓN BLOCK
  if (guia && cajonBlock) {
    const resultadoCajon = calcularPrecioCortina({
      tipo: "cajon_block",
      material: "aluminio",
      color: color === "simil_madera" ? "simil_madera" : "blanco",
      ancho,
      alto,
    });

    const c = resultadoCajon.costoBase;

    totalRajas += c;

    items.push({
      tipo: "cajon_block",
      precio: Math.round(c),
    });

    audit.add({
      etapa: "Cajón Block",
      tipo: "extra",
      origen: "calcularPrecioCortina",
      valorAntes: totalRajas - c,
      valorAplicado: c,
      valorDespues: totalRajas,
    });
  }

  // =========================
  // 💰 COSTO BASE
  // =========================
  const costoBase =
    Number(totalRajas || 0) +
    Number(fijo?.costoBase || 0) +
    Number(acople?.costoBase || 0) +
    Number(extras || 0);

  audit.add({
    etapa: "Costo Base",

    tipo: "base",

    origen: "wrapper",

    valorAntes: 0,

    valorAplicado: costoBase,

    valorDespues: costoBase,

    metadata: {
      totalRajas,

      panoFijo: Number(fijo?.costoBase || 0),

      perfilAcople: Number(acople?.costoBase || 0),
    },
  });

  // =========================
  // 💰 PERFIL
  // =========================

  const perfilData = perfiles?.[perfil]?.[lineaNormalizada] ||
    perfiles?.amarilla?.[lineaNormalizada] || {
      descuento: 0,

      flete: 0,

      ganancia: 0.35,
    };

  const costo = costoBase * (1 - Number(perfilData.descuento || 0));

  const proveedor = costo * (1 + Number(perfilData.flete || 0));

  const venta = proveedor * (1 + Number(perfilData.ganancia || 0));

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
  // ✅ RESPONSE
  // =========================
  return buildWrapperResponse({
    // =========================
    // IDENTIDAD
    // =========================

    modulo: "patagonicas",

    linea: lineaNormalizada,

    // =========================
    // COSTOS
    // =========================

    costoBase,

    costo,

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

    margenAplicado: Math.round(perfilData.ganancia * 100),

    // =========================
    // RESULTADO
    // =========================

    ganancia: venta - costo,

    descripcion: `Patagónica Herrero ${medidaTotal}`,

    items,

    configuracion: {
      medidaTotal,

      tipo,

      color,

      cantidadRajas,

      anchoRaja: anchoRajaFinal,

      anchoFijo,

      tipoVidrio,

      linea: lineaNormalizada,

      svg: buildPatagonicaSVG({
        cantidadRajas,
        ladoApertura,
        tipoApertura,
      }),
    },

    audit: audit.getSteps(),
  });
}

module.exports = calcularWrapper;
