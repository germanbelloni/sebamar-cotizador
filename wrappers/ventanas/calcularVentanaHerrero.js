// wrappers/ventanas/calcularVentanaHerrero.js

const { fromRoot } = require("../../backend/utils/path");

const buildWrapperResponse = require(
  fromRoot("backend/utils/buildWrapperResponse"),
);

const AuditBuilder = require(fromRoot("backend/audit/AuditBuilder"));

const calcularVentana = require(
  fromRoot("backend/services/ventanas/calcularVentana"),
);
const buscarMedidaSuperior = require(
  fromRoot("backend/utils/buscarMedidaSuperior"),
);
const perfiles = require(fromRoot("backend/config/perfiles"));

const calcularPrecioCortina = require(
  fromRoot("backend/services/cortinas/calcularPrecioCortina"),
);
const ventanas = require(
  fromRoot("backend/data/productos/ventanas_herrero.json"),
);

const colores = require(fromRoot("backend/data/colores.json"));

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
    if (!["estructura", "mosquitero"].includes(item.tipo)) {
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
  const audit = new AuditBuilder();
  const {
    ancho,
    alto,
    color = "blanco",
    tipoVidrio = "3mm",
    vidrioRepartido = false,
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

  const lookup = buscarMedidaSuperior(
    ventanas.medidas,
    `${ancho}x${alto > 200 ? 200 : alto}`,
  );

  if (!lookup) {
    throw new Error("No hay medida válida");
  }

  const medida = lookup.medida;

  audit.add({
    etapa: "Lookup",

    tipo: "lookup",

    origen: "ventanas_herrero.json",

    referencia: medida,

    metadata: {
      anchoSolicitado: ancho,
      altoSolicitado: alto,
      medidaUtilizada: medida,
    },
  });

  const base = calcularVentana({
    medida,
    tipoVidrio,
    incluirGuia: guia,
    incluirMosquitero: mosquitero,
    linea: "herrero",
  });
  audit.add({
    etapa: "Costo Base",
    tipo: "base",
    origen: "ventanas_herrero.json",

    valorAntes: 0,
    valorAplicado: base.costoBase,
    valorDespues: base.costoBase,

    metadata: {
      medida,
    },
  });

  // 🎨 COLOR SOLO ESTRUCTURA

  const estructuraOriginal =
    base.items.find((i) => i.tipo === "estructura")?.precio || 0;

  const vidrio = base.items.find((i) => i.tipo === "vidrio")?.precio || 0;

  const items = aplicarColor([...base.items], color);

  const estructuraColor =
    items.find((i) => i.tipo === "estructura")?.precio || 0;

  let costo = items.reduce((acc, i) => acc + Number(i.precio || 0), 0);

  const colorData = colores.find((c) => c.nombre === color);

  const porcentajeColor = Number(colorData?.valor || 0);

  audit.add({
    etapa: "Color",

    tipo: "color",

    descripcion: `Recargo color ${color}`,

    origen: "colores.json",

    referencia: color,

    porcentaje: porcentajeColor,

    valorAntes: base.costoBase,

    valorAplicado: estructuraColor - estructuraOriginal,

    valorDespues: costo,

    metadata: {
      estructuraOriginal,

      estructuraColor,

      vidrio,

      porcentajeColor,

      incremento: estructuraColor - estructuraOriginal,

      costoBase: base.costoBase,
    },
  });

  // 🪟 VIDRIO REPARTIDO
  if (vidrioRepartido) {
    const recargo = Math.round(costo * 0.3);

    costo += recargo;

    items.push({
      tipo: "vidrio_repartido",
      precio: recargo,
    });

    audit.add({
      etapa: "Vidrio Repartido",
      tipo: "extra",
      origen: "wrapper",

      valorAntes: costo - recargo,
      valorAplicado: recargo,
      valorDespues: costo,
    });
  }

  // 🪟 CORTINA PVC (siempre reforzada)
  if (cortina === "pvc") {
    const resultadoCortina = calcularPrecioCortina({
      tipo: "cortina",
      material: "pvc",
      calidad: "reforzada",
      construccion: "completa",
      ancho,
      alto,
    });

    const c = resultadoCortina.costoBase;

    costo += c;

    audit.add({
      etapa: "Cortina PVC",
      tipo: "extra",
      origen: "calcularPrecioCortina",

      valorAntes: costo - c,
      valorAplicado: c,
      valorDespues: costo,
    });

    items.push({
      tipo: "cortina_pvc",
      precio: c,
    });
  }
  // 🪟 CORTINA ALUMINIO
  if (cortina === "aluminio") {
    const resultadoCortina = calcularPrecioCortina({
      tipo: "cortina",
      material: "aluminio",
      construccion: "completa",
      color: color === "simil_madera" ? "simil_madera" : "blanco",
      ancho,
      alto,
    });

    const c = resultadoCortina.costoBase;

    costo += c;

    audit.add({
      etapa: "Cortina Aluminio",
      tipo: "extra",
      origen: "calcularPrecioCortina",

      valorAntes: costo - c,
      valorAplicado: c,
      valorDespues: costo,
    });

    items.push({
      tipo: "cortina_aluminio",
      precio: c,
    });
  }

  if (cajonBlock) {
    const resultadoCajon = calcularPrecioCortina({
      tipo: "cajon_block",
      material: "aluminio",
      color: color === "simil_madera" ? "simil_madera" : "blanco",
      ancho,
      alto,
    });

    const c = resultadoCajon.costoBase;

    costo += c;

    audit.add({
      etapa: "Cajón Block",
      tipo: "extra",
      origen: "calcularPrecioCortina",
      valorAntes: costo - c,
      valorAplicado: c,
      valorDespues: costo,
    });

    items.push({
      tipo: "cajon_block",
      precio: c,
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
  const perfilHerrero = perfiles[perfil]?.herrero || perfiles.amarilla.herrero;

  const perfilMosquitero =
    perfiles[perfil]?.mosquiteros || perfiles.amarilla.mosquiteros;

  const costoMosquitero =
    items.find((i) => i.tipo === "mosquitero")?.precio || 0;

  const costoHerrero = costo - costoMosquitero;

  const { proveedor: proveedorHerrero, venta: ventaHerrero } = aplicarPerfil(
    costoHerrero,
    perfilHerrero,
  );

  const { proveedor: proveedorMosquitero, venta: ventaMosquitero } =
    aplicarPerfil(costoMosquitero, perfilMosquitero);

  const proveedor = proveedorHerrero + proveedorMosquitero;

  const venta = ventaHerrero + ventaMosquitero;

  const perfilData = perfilHerrero;

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

  // return buildWrapperResponse({
  const response = buildWrapperResponse({
    // =========================
    // IDENTIDAD
    // =========================

    modulo: "ventanas",

    linea: "herrero",

    // =========================
    // COSTOS
    // =========================

    costoBase: base.costoBase,

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

    descripcion: `Ventana herrero ${ancho}x${alto}`,

    items,

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
    //   audit: audit.getSteps(),
    // });
    audit: audit.getSteps(),
  });

  return response;
}

module.exports = calcularVentanaHerrero;
