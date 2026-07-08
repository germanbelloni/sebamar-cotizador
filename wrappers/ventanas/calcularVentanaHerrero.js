// wrappers/ventanas/calcularVentanaHerrero.js

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

const ventanas = require(
  fromRoot("backend/data/productos/ventanas_herrero.json"),
);

const colores = require(fromRoot("backend/data/colores.json"));

// 📐
const calcularM2 = (a, h) => (a * h) / 10000;

// 🔍 LOOKUP
function buscarMedidaValida(ancho, alto) {
  const medidas = Object.keys(ventanas.medidas);

  const anchos = [
    ...new Set(medidas.map((m) => Number(m.split("x")[0].replace(",", ".")))),
  ].sort((a, b) => a - b);

  const altos = [
    ...new Set(
      medidas.map((m) => {
        const valor = Number(m.split("x")[1].replace(",", "."));

        // los viejos vienen como 0,40 / 0,60 / 0,80
        return valor < 1 ? valor * 100 : valor;
      }),
    ),
  ].sort((a, b) => a - b);

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

// 🚀 WRAPPER
function calcularVentanaHerrero(dataInput) {
  const audit = new AuditBuilder();
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

  const m2 = calcularM2(ancho, alto);

  // 🪟 CORTINA PVC
  if (cortina === "pvc") {
    const c = Number(superficies.cortinas?.pvc || 0) * m2;

    costo += c;

    audit.add({
      etapa: "Cortina PVC",

      tipo: "extra",

      origen: "superficies.json",

      valorAntes: costo - c,

      valorAplicado: c,

      valorDespues: costo,
    });

    if (c > 0) {
      items.push({
        tipo: "cortina_pvc",
        precio: Math.round(c),
      });
    }
  }
  // 🪟 CORTINA ALUMINIO
  if (cortina === "aluminio") {
    const c = Number(superficies.cortinas?.aluminio || 0) * m2;

    costo += c;

    audit.add({
      etapa: "Cortina Aluminio",

      tipo: "extra",

      origen: "superficies.json",

      valorAntes: costo - c,

      valorAplicado: c,

      valorDespues: costo,
    });

    if (c > 0) {
      items.push({
        tipo: "cortina_aluminio",
        precio: Math.round(c),
      });
    }
  }

  // 📦 CAJON BLOCK
  let anchoFinal = ancho;
  let altoFinal = alto;

  if (cajonBlock) {
    anchoFinal += 8;
    altoFinal += 20;
  }

  // 💰 PERFIL
  console.log("PERFIL:", perfil);
  console.log("PERFILES:", Object.keys(perfiles));
  console.log("PERFIL DATA:", perfiles[perfil]);
  const perfilData = perfiles[perfil]?.herrero || perfiles.amarilla.herrero;

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
  console.log("===== VALORES WRAPPER =====");
  console.log({
    costo,
    proveedor,
    venta,
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

  console.log("===== RESPONSE WRAPPER =====");
  console.dir(response, { depth: null });

  return response;
}

module.exports = calcularVentanaHerrero;
