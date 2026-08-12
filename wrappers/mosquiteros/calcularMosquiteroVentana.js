const { fromRoot } = require("../../backend/utils/path");

const calcularMosquitero = require(
  fromRoot("services/mosquiteros/calcularMosquitero"),
);
const buildWrapperResponse = require(
  fromRoot("backend/utils/buildWrapperResponse"),
);
const AuditBuilder = require(fromRoot("backend/audit/AuditBuilder"));
const perfiles = require(fromRoot("config/perfiles"));

const colores = require(fromRoot("backend/data/colores.json"));

const mosquiterosData = require(
  fromRoot("backend/data/productos/mosquiteros.json"),
);

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

function buscarMedidaValida(anchoInput, altoInput) {
  const medidas = Object.keys(mosquiterosData.medidas).map((k) => {
    const [a, b] = k.split("x");

    return {
      key: k,
      ancho: Number(a),
      alto:
        Number(b.replace(",", ".")) < 10
          ? Number(b.replace(",", ".")) * 100
          : Number(b.replace(",", ".")),
    };
  });

  const candidatas = medidas
    .filter((m) => m.ancho >= anchoInput && m.alto >= altoInput)
    .sort((a, b) => {
      const areaA = a.ancho * a.alto;
      const areaB = b.ancho * b.alto;

      return areaA - areaB;
    });

  if (!candidatas.length) {
    throw new Error("No hay medida válida");
  }

  return candidatas[0];
}

// =========================
// 🚀 WRAPPER
// =========================

function calcularMosquiteroVentana(dataInput) {
  const audit = new AuditBuilder();
  const { ancho, alto, color = "blanco", perfil = "amarilla" } = dataInput;

  if (!["blanco", "negro"].includes(color)) {
    throw new Error("El mosquitero de ventana solo admite blanco y negro");
  }

  const medidaValida = buscarMedidaValida(ancho, alto);

  audit.add({
    etapa: "Lookup",
    tipo: "lookup",
    origen: "mosquiteros.json",
    referencia: medidaValida.key,

    metadata: {
      anchoSolicitado: ancho,
      altoSolicitado: alto,
      medidaUtilizada: medidaValida.key,
    },
  });

  // =========================
  // 🧠 SERVICE
  // =========================

  const base = calcularMosquitero({
    medida: medidaValida.key,
  });

  audit.add({
    etapa: "Costo Base",
    tipo: "base",
    origen: "mosquiteros.json",

    valorAntes: 0,
    valorAplicado: base.costoBase,
    valorDespues: base.costoBase,

    metadata: {
      medida: medidaValida.key,
    },
  });

  let costo = Number(base.costoBase || 0);

  const items = [...base.items];

  // =========================
  // 🎨 COLOR
  // =========================

  const estructura = items
    .filter((i) => i.tipo === "estructura")
    .reduce((acc, i) => acc + Number(i.precio || 0), 0);

  const colorFactor = getColorFactor(color);

  const costoColor = estructura * colorFactor;

  if (costoColor > 0) {
    costo += costoColor;

    items.push({
      tipo: "color",
      descripcion: color,
      precio: Math.round(costoColor),
    });
  }

  audit.add({
    etapa: "Color",

    tipo: "color",

    descripcion: `Recargo color ${color}`,

    origen: "colores.json",

    referencia: color,

    porcentaje: colorFactor,

    valorAntes: base.costoBase,

    valorAplicado: costoColor,

    valorDespues: costo,

    metadata: {
      estructuraOriginal: estructura,
      estructuraColor: estructura + costoColor,
      incremento: costoColor,
      porcentajeColor: colorFactor,
    },
  });
  // =========================
  // 💰 PERFIL
  // =========================

  const perfilData = perfiles[perfil]?.moscas || perfiles.amarilla.moscas;

  let costoFinal = costo;

  costoFinal *= 1 + perfilData.aumento1;
  costoFinal *= 1 + perfilData.aumento2;

  const venta = costoFinal * (1 + perfilData.ganancia);

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
      aumento1: perfilData.aumento1,
      aumento2: perfilData.aumento2,
      ganancia: perfilData.ganancia,

      proveedor: costo,
      venta,
    },
  });

  const costoBase = Math.round(costo);
  // =========================
  // ✅ RESPONSE
  // =========================

  return buildWrapperResponse({
    modulo: "mosquiteros",

    linea: "moscas",

    costoBase,

    costo,

    precioBase: costo,

    precioProveedor: costo,

    precioLista: venta,

    precioFinal: venta,

    perfilAplicado: perfil,

    descuentoAplicado: 0,

    fleteAplicado: 0,

    gananciaAplicada: perfilData.ganancia,

    margenAplicado: 0,

    ganancia: venta - costo,

    items,

    descripcion: `Mosquitero ventana ${ancho}x${alto}`,

    configuracion: {
      ancho,
      alto,
      medidaUsada: medidaValida.key,
      color,
    },

    audit: audit.getSteps(),
  });
}

module.exports = calcularMosquiteroVentana;
