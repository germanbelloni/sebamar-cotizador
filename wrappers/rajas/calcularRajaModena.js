// wrappers/rajas/calcularRajaModena.js

const { fromRoot } = require("../../backend/utils/path");

const calcularRaja = require(fromRoot("backend/services/rajas/calcularRaja"));

const buildWrapperResponse = require(
  fromRoot("backend/utils/buildWrapperResponse"),
);

const AuditBuilder = require(fromRoot("backend/audit/AuditBuilder"));

const superficies = require(
  fromRoot("backend/data/productos/superficies.json"),
);

const perfiles = require(fromRoot("backend/config/perfiles"));

const colores = require(fromRoot("backend/data/colores.json"));

const data = require(fromRoot("backend/data/productos/rajas_modena.json"));

// 📐
const calcularM2 = (a, h) => (a * h) / 10000;

const calcularML = (a, h) => (a * 2 + h * 2) / 100;

// 🔍
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
function calcularRajaModena(dataInput) {
  const audit = new AuditBuilder();
  const {
    ancho,
    alto,
    vidrio,
    color = "blanco",
    mosquitero,
    herrajesBlancos,
    modelo = "raja",
    premarco,
    contramarco,
    perfil = "amarilla",
    bisagra,
  } = dataInput;
  console.log("MODELO RECIBIDO:", modelo);
  console.log("EXTRAS:", superficies.extras);
  console.log("BRAZO EXTRA:", superficies.extras["brazo_de_empuje"]);
  console.log("VOLCABLE EXTRA:", superficies.extras.volcable);

  if (!ancho || !alto) {
    throw new Error("Faltan medidas");
  }

  const medida = buscarMedidaValida(ancho, alto);

  audit.add({
    etapa: "Lookup",

    tipo: "lookup",

    origen: "rajas_modena.json",

    referencia: medida,

    metadata: {
      anchoSolicitado: ancho,
      altoSolicitado: alto,
      medidaUtilizada: medida,
    },
  });

  const vidrioFinal = vidrio || "4mm";

  const base = calcularRaja({
    medida,
    tipoVidrio: vidrioFinal,
    linea: "modena",
  });

  audit.add({
    etapa: "Costo Base",

    tipo: "base",

    origen: "rajas_modena.json",

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

  const vidrioCosto = base.items.find((i) => i.tipo === "vidrio")?.precio || 0;

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
      vidrio: vidrioCosto,
      porcentajeColor,
      incremento: estructuraColor - estructuraOriginal,
      costoBase: base.costoBase,
    },
  });

  const m2 = calcularM2(ancho, alto);

  const ml = calcularML(ancho, alto);

  // 🧵 MOSQUITERO
  if (mosquitero) {
    const c = Number(superficies.superficies.mosquitero_fijo || 0) * m2;

    costo += c;

    audit.add({
      etapa: "Mosquitero",

      tipo: "extra",

      origen: "superficies.json",

      valorAntes: costo - c,

      valorAplicado: c,

      valorDespues: costo,
    });

    if (c > 0) {
      items.push({
        tipo: "mosquitero",
        precio: Math.round(c),
      });
    }
  }

  // 🔧 OSCILOBATIENTE
  if (modelo === "oscilobatiente") {
    const c = Number(superficies.extras.oscilobatiente || 0);

    costo += c;

    audit.add({
      etapa: "Oscilobatiente",

      tipo: "extra",

      origen: "superficies.json",

      referencia: "oscilobatiente",

      valorAntes: costo - c,

      valorAplicado: c,

      valorDespues: costo,
    });
    items.push({
      tipo: "oscilobatiente",
      precio: Math.round(c),
    });
  }

  // 🔧 BRAZO DE EMPUJE
  if (modelo === "brazo") {
    const c = Number(superficies.extras["brazo_de_empuje"] || 0);

    costo += c;

    audit.add({
      etapa: "Brazo",

      tipo: "extra",

      origen: "superficies.json",

      referencia: "brazo_de_empuje",

      valorAntes: costo - c,

      valorAplicado: c,

      valorDespues: costo,
    });

    items.push({
      tipo: "brazo",
      precio: Math.round(c),
    });
  }

  // 🔧 VOLCABLE
  if (modelo === "volcable") {
    const c = Number(superficies.extras.volcable || 0);

    costo += c;

    audit.add({
      etapa: "Volcable",

      tipo: "extra",

      origen: "superficies.json",

      referencia: "volcable",

      valorAntes: costo - c,

      valorAplicado: c,

      valorDespues: costo,
    });
    items.push({
      tipo: "volcable",
      precio: Math.round(c),
    });
  }

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

  // 📏 ALTURA
  if (alto > 150) {
    costo *= 1.3;
  }

  audit.add({
    etapa: "Recargo Altura",

    tipo: "recargo",

    origen: "wrapper",

    valorAntes: costo / 1.3,

    valorAplicado: costo - costo / 1.3,

    valorDespues: costo,
  });

  // 💰 PERFIL
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
  const nombreModelo =
    modelo === "oscilobatiente"
      ? "Oscilobatiente"
      : modelo === "volcable"
        ? "Volcable"
        : modelo === "brazo"
          ? "Brazo"
          : "Raja";

  return buildWrapperResponse({
    // =========================
    // IDENTIDAD
    // =========================

    modulo: "rajas",

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

    descripcion: `${nombreModelo} Modena ${ancho}x${alto}`,

    items,

    configuracion: {
      ancho,
      alto,

      medidaUsada: medida,

      color,

      vidrio: vidrioFinal,

      mosquitero: !!mosquitero,

      modelo,

      premarco: !!premarco,

      contramarco: !!contramarco,

      herrajesBlancos: !!herrajesBlancos,

      svg: {
        tipo: "raja_modena",

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

    audit: audit.getSteps(),
  });
}

module.exports = calcularRajaModena;
