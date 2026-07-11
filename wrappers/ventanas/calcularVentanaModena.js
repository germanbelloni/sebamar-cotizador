// wrappers/ventanas/calcularVentanaModena.js

const { fromRoot } = require("../../backend/utils/path");
const buildWrapperResponse = require(
  fromRoot("backend/utils/buildWrapperResponse"),
);

const AuditBuilder = require(fromRoot("backend/audit/AuditBuilder"));

const calcularVentana = require(
  fromRoot("backend/services/ventanas/calcularVentana"),
);

const perfiles = require(fromRoot("backend/config/perfiles"));

const superficies = require(
  fromRoot("backend/data/productos/superficies.json"),
);

const colores = require(fromRoot("backend/data/colores.json"));

// 📐
const calcularM2 = (a, h) => (a * h) / 10000;

const calcularML = (a, h) => (a * 2 + h * 2) / 100;

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
    if (!["estructura", "mosquitero", "contramarco"].includes(item.tipo)) {
      return item;
    }

    return {
      ...item,
      precio: Math.round(item.precio * (1 + porcentaje)),
    };
  });
}
//Helper
function formatearMedida(valor) {
  const n = Number(valor);

  if (n < 10) {
    return n.toFixed(2).replace(".", ",");
  }

  return String(Math.round(n));
}
// 🚀 WRAPPER
function calcularVentanaModena(dataInput) {
  const audit = new AuditBuilder();

  const {
    ancho,
    alto,
    color = "blanco",
    tipoVidrio,
    guia,
    mosquitero,
    cortina,
    cajonBlock,
    premarco,
    contramarco,
    bipuntoIzquierda = "ninguno",
    bipuntoDerecha = "ninguno",
    perfil = "amarilla",
  } = dataInput;

  if (!ancho || !alto) {
    throw new Error("Faltan medidas");
  }

  let bipunto = 0;
  let bipuntoConLlave = 0;

  [bipuntoIzquierda, bipuntoDerecha].forEach((v) => {
    if (v === "normal") {
      bipunto++;
    }

    if (v === "llave") {
      bipuntoConLlave++;
    }
  });
  const medida = `${formatearMedida(ancho)}x${formatearMedida(
    alto > 200 ? 200 : alto,
  )}`;
  audit.add({
    etapa: "Lookup",

    tipo: "lookup",

    origen: "ventanas_modena.json",

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
    linea: "modena",
  });

  audit.add({
    etapa: "Costo Base",

    tipo: "base",

    origen: "ventanas_modena.json",

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
  const m2 = calcularM2(ancho, alto);

  const ml = calcularML(ancho, alto);

  // 🪚 PREMARCO
  if (premarco) {
    const c = Number(superficies.superficies.premarco || 0) * ml;

    costo += c;

    audit.add({
      etapa: "Premarco",

      tipo: "extra",

      origen: "superficies.json",

      valorAntes: costo - c,

      valorAplicado: c,

      valorDespues: costo,
    });

    if (c > 0) {
      items.push({
        tipo: "premarco",
        precio: Math.round(c),
      });
    }
  }
  // 🪚 CONTRAMARCO
  if (premarco || contramarco) {
    const c = Number(superficies.superficies.contramarco || 0) * ml;

    costo += c;

    audit.add({
      etapa: "Contramarco",

      tipo: "extra",

      origen: "superficies.json",

      valorAntes: costo - c,

      valorAplicado: c,

      valorDespues: costo,
    });

    if (c > 0) {
      items.push({
        tipo: "contramarco",
        precio: Math.round(c),
      });
    }
  }

  if (bipunto > 0) {
    const c = Number(superficies.extras.bipunto || 0) * Number(bipunto);

    costo += c;

    items.push({
      tipo: "extra",
      descripcion: `Bipunto x${bipunto}`,
      cantidad: bipunto,
      precio: c,
    });

    audit.add({
      etapa: "Bipunto",
      tipo: "extra",
      origen: "superficies.json",
      valorAntes: costo - c,
      valorAplicado: c,
      valorDespues: costo,
      metadata: {
        cantidad: bipunto,
      },
    });
  }

  if (bipuntoConLlave > 0) {
    const c =
      Number(superficies.extras.bipunto_con_llave || 0) *
      Number(bipuntoConLlave);

    costo += c;

    items.push({
      tipo: "extra",
      descripcion: `Bipunto con llave x${bipuntoConLlave}`,
      cantidad: bipuntoConLlave,
      precio: c,
    });

    audit.add({
      etapa: "Bipunto con llave",
      tipo: "extra",
      origen: "superficies.json",
      valorAntes: costo - c,
      valorAplicado: c,
      valorDespues: costo,
      metadata: {
        cantidad: bipuntoConLlave,
      },
    });
  }

  // 📏 ALTURA
  if (alto > 200) {
    costo *= 1.1;
  }

  if (alto > 200) {
    audit.add({
      etapa: "Recargo Altura",

      tipo: "recargo",

      origen: "wrapper",

      valorAntes: costo / 1.1,

      valorAplicado: costo - costo / 1.1,

      valorDespues: costo,
    });
  }

  // 💰 PERFIL
  const perfilModena = perfiles[perfil]?.modena || perfiles.amarilla.modena;

  const perfilMosquitero =
    perfiles[perfil]?.mosquiteros || perfiles.amarilla.mosquiteros;
  const perfilPremarcos =
    perfiles[perfil]?.premarcos || perfiles.amarilla.premarcos;

  const costoMosquitero =
    items.find((i) => i.tipo === "mosquitero")?.precio || 0;

  const costoPremarcos = items
    .filter((i) => i.tipo === "premarco" || i.tipo === "contramarco")
    .reduce((acc, i) => acc + Number(i.precio || 0), 0);
  const costoModena = costo - costoMosquitero - costoPremarcos;

  const { proveedor: proveedorModena, venta: ventaModena } = aplicarPerfil(
    costoModena,
    perfilModena,
  );

  const { proveedor: proveedorPremarcos, venta: ventaPremarcos } =
    aplicarPerfil(costoPremarcos, perfilPremarcos);

  const { proveedor: proveedorMosquitero, venta: ventaMosquitero } =
    aplicarPerfil(costoMosquitero, perfilMosquitero);

  const proveedor = proveedorModena + proveedorMosquitero + proveedorPremarcos;

  const venta = ventaModena + ventaMosquitero + ventaPremarcos;

  const perfilData = perfilModena;
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

  return buildWrapperResponse({
    // =========================
    // IDENTIDAD
    // =========================

    modulo: "ventanas",

    linea: "modena",

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

    descripcion: `Ventana modena ${ancho}x${alto}`,

    items,

    configuracion: {
      ancho,
      alto,
      color,
      tipoVidrio,
      mosquitero: !!mosquitero,
      premarco: !!premarco,
      contramarco: !!contramarco,

      bipuntoIzquierda,
      bipuntoDerecha,
      svg: {
        tipo: "ventana_modena",
        hojas: ancho > 240 ? 2 : 1,
        mosquitero: !!mosquitero,
        premarco: !!premarco,
        contramarco: !!contramarco,

        bipuntoIzquierda,
        bipuntoDerecha,
      },
    },
    audit: audit.getSteps(),
  });
}

module.exports = calcularVentanaModena;
