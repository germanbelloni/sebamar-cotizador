const { fromRoot } = require("../../backend/utils/path");

const calcularRaja = require(fromRoot("backend/services/rajas/calcularRaja"));

const buildWrapperResponse = require(
  fromRoot("backend/utils/buildWrapperResponse"),
);

const AuditBuilder = require(fromRoot("backend/audit/AuditBuilder"));

const perfiles = require(fromRoot("backend/config/perfiles"));

const colores = require(fromRoot("backend/data/colores.json"));

const superficies = require(
  fromRoot("backend/data/productos/superficies.json"),
);

const dataHerrero = require(
  fromRoot("backend/data/productos/rajas_herrero.json"),
);

const dataModena = require(
  fromRoot("backend/data/productos/rajas_modena.json"),
);

// ======================================
// HELPERS
// ======================================

const calcularM2 = (ancho, alto) => (ancho * alto) / 10000;

const calcularML = (ancho, alto) => (ancho * 2 + alto * 2) / 100;

function aplicarPerfil(costo, perfilData) {
  const proveedor = costo * (1 - perfilData.descuento);

  const venta = proveedor * (1 + perfilData.flete) * (1 + perfilData.ganancia);

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

    const precio = Math.round(item.precio * (1 + porcentaje));

    return {
      ...item,
      precio,
      subtotal: precio,
    };
  });
}

function buscarMedida(data, ancho, alto) {
  const exacta = `${ancho}x${alto}`;

  if (data.medidas?.[exacta]) {
    return exacta;
  }

  const medidas = Object.keys(data.medidas).map((m) => {
    const [w, h] = m.split("x").map(Number);

    return {
      key: m,
      w,
      h,
    };
  });

  const anchoSuperior =
    medidas
      .map((m) => m.w)
      .sort((a, b) => a - b)
      .find((v) => v >= ancho) || ancho;

  const altoSuperior =
    medidas
      .map((m) => m.h)
      .sort((a, b) => a - b)
      .find((v) => v >= alto) || alto;

  const encontrada = medidas.find(
    (m) => m.w === anchoSuperior && m.h === altoSuperior,
  );

  if (!encontrada) {
    throw new Error(`No existe medida para ${ancho}x${alto}`);
  }

  return encontrada.key;
}
// ======================================
// MAIN
// ======================================

function calcularVentanaAbrir(dataInput) {
  const audit = new AuditBuilder();

  const {
    ancho,
    alto,
    linea = "Herrero",
    color = "blanco",
    tipoVidrio = "4mm",
    mosquitero = false,
    bisagra = "izquierda",
    premarco = false,
    contramarco = false,
    herrajesBlancos = false,
    perfil = "amarilla",
  } = dataInput;

  if (!ancho || !alto) {
    throw new Error("Faltan medidas");
  }
  const esHerrero = linea.toLowerCase() === "herrero";

  const data = esHerrero ? dataHerrero : dataModena;

  const anchoHoja = Math.ceil(ancho / 2);

  const altoBusqueda = esHerrero ? Math.min(alto, 150) : alto;

  console.log({
    anchoVentana: ancho,
    anchoHoja,
    altoBusqueda,
  });

  const medida = buscarMedida(data, anchoHoja, altoBusqueda);
  audit.add({
    etapa: "Lookup",

    tipo: "lookup",

    origen: esHerrero ? "rajas_herrero.json" : "rajas_modena.json",

    referencia: medida,
  });

  // ======================================
  // CALCULAR LAS DOS HOJAS
  // ======================================

  const hojaIzquierda = calcularRaja({
    medida,

    tipoVidrio,

    linea: esHerrero ? "herrero" : "modena",

    bisagra: "izquierda",
  });

  const hojaDerecha = calcularRaja({
    medida,

    tipoVidrio,

    linea: esHerrero ? "herrero" : "modena",

    bisagra: "derecha",
  });

  let items = [...hojaIzquierda.items, ...hojaDerecha.items];

  let costoBase = hojaIzquierda.costoBase + hojaDerecha.costoBase;

  audit.add({
    etapa: "Costo Base",

    tipo: "base",

    origen: "calcularRaja",

    valorAntes: 0,

    valorAplicado: costoBase,

    valorDespues: costoBase,
  }); // ======================================
  // COLOR
  // ======================================

  items = aplicarColor(items, color);

  let costo = items.reduce((acc, item) => acc + Number(item.precio || 0), 0);

  audit.add({
    etapa: "Color",

    tipo: "color",

    origen: "colores.json",

    referencia: color,

    valorAntes: costoBase,

    valorAplicado: costo - costoBase,

    valorDespues: costo,
  });

  // ======================================
  // MOSQUITERO
  // ======================================

  const m2 = calcularM2(ancho, alto);

  if (mosquitero) {
    const extra = Number(superficies.superficies.mosquitero_fijo || 0) * m2;

    costo += extra;

    items.push({
      tipo: "mosquitero",
      precio: Math.round(extra),
    });

    audit.add({
      etapa: "Mosquitero",

      tipo: "extra",

      origen: "superficies.json",

      valorAntes: costo - extra,

      valorAplicado: extra,

      valorDespues: costo,
    });
  }

  // ======================================
  // PREMARCO / CONTRAMARCO
  // ======================================

  if (!esHerrero) {
    const ml = calcularML(ancho, alto);

    if (premarco) {
      const extra = Number(superficies.superficies.premarco || 0) * ml;

      costo += extra;

      items.push({
        tipo: "premarco",
        precio: Math.round(extra),
      });
    }

    if (premarco || contramarco) {
      const extra = Number(superficies.superficies.contramarco || 0) * ml;

      costo += extra;

      items.push({
        tipo: "contramarco",
        precio: Math.round(extra),
      });
    }
  }
  // ======================================
  // CP8 (2 unidades)
  // ======================================

  const costoCP8 = Number(superficies.extras.cp8 || 0) * 2;

  costo += costoCP8;

  items.push({
    tipo: "cp8",
    cantidad: 2,
    precio: costoCP8,
  });

  audit.add({
    etapa: "CP8",

    tipo: "extra",

    origen: "superficies.json",

    referencia: "cp8 x2",

    valorAntes: costo - costoCP8,

    valorAplicado: costoCP8,

    valorDespues: costo,
  });
  // ======================================
  // RECARGO ALTURA
  // ======================================

  if (alto > 150) {
    costo *= 1.3;
  }

  // ======================================
  // PERFIL
  // ======================================

  const perfilData =
    perfiles[perfil]?.[esHerrero ? "herrero" : "modena"] ||
    perfiles.amarilla[esHerrero ? "herrero" : "modena"];

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

  return buildWrapperResponse({
    // =========================
    // IDENTIDAD
    // =========================

    modulo: "ventanas-abrir",

    linea: esHerrero ? "herrero" : "modena",

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

    descripcion: `Ventana de Abrir ${linea} ${ancho}x${alto} - 2 hojas c/CP8`,

    items,

    configuracion: {
      ancho,
      alto,

      color,

      tipoVidrio,

      mosquitero,

      bisagra,

      premarco,

      contramarco,

      herrajesBlancos,
      svg: {
        tipo: "ventana_abrir",

        hojaPrincipal: bisagra,

        hojaSecundaria: bisagra === "izquierda" ? "derecha" : "izquierda",
      },
    },

    audit: audit.getSteps(),
  });
}

module.exports = calcularVentanaAbrir;
