const { fromRoot } = require("../../backend/utils/path");

const calcularCortinas = require(
  fromRoot("services/cortinas/calcularCortinas"),
);

const buildWrapperResponse = require(
  fromRoot("backend/utils/buildWrapperResponse"),
);

const AuditBuilder = require(fromRoot("backend/audit/AuditBuilder"));

const perfiles = require(fromRoot("config/perfiles"));

function calcularCortinasWrapper(dataInput) {
  const audit = new AuditBuilder();

  const {
    tipo,
    material,
    calidad,
    construccion,
    color = "blanco",
    ancho,
    alto,
    cantidad,
    perfil = "amarilla",
  } = dataInput;

  if (tipo === "varillas") {
    if (!ancho || !cantidad) {
      throw new Error("Faltan datos");
    }
  } else {
    if (!tipo || !material || !ancho || !alto) {
      throw new Error("Faltan datos");
    }
  }

  // ========================
  // 🧠 SERVICE
  // ========================

  const resultado = calcularCortinas({
    tipo,
    material,
    calidad,
    construccion,
    color,
    ancho,
    alto,
    cantidad,
  });

  const items = [...resultado.items];

  const costoBase = resultado.costoBase;

  audit.add({
    etapa: "Lookup",
    tipo: "lookup",
    origen: "superficies.json",
    referencia: `${tipo}-${material}`,
    metadata: {
      tipo,
      material,
      calidad,
      construccion,
      color,
      ancho,
      alto,
    },
  });

  // ========================
  // 🧾 IVA
  // ========================

  const costoConIva = costoBase * 1.21;

  audit.add({
    etapa: "IVA",
    tipo: "iva",
    origen: "cortinas",

    porcentaje: 0.21,

    valorAntes: costoBase,

    valorAplicado: Number((costoConIva - costoBase).toFixed(2)),

    valorDespues: Number(costoConIva.toFixed(2)),
  });

  // ========================
  // 💰 PERFIL
  // ========================

  const perfilData = perfiles[perfil]?.cortinas;

  if (!perfilData) {
    throw new Error(`Perfil inválido: ${perfil} - cortinas`);
  }

  const costoFinal = costoConIva * (1 - perfilData.descuento);

  const proveedor = costoFinal * (1 + perfilData.flete);

  const venta = proveedor * (1 + perfilData.ganancia);

  audit.add({
    etapa: "Perfil",

    tipo: "perfil",

    origen: "perfiles.js",

    referencia: perfil,

    valorAntes: costoConIva,

    valorAplicado: Number((venta - costoConIva).toFixed(2)),

    valorDespues: Number(venta.toFixed(2)),

    porcentaje: perfilData.ganancia,

    metadata: {
      descuento: perfilData.descuento,

      flete: perfilData.flete,

      ganancia: perfilData.ganancia,

      proveedor: Number(proveedor.toFixed(2)),

      venta: Number(venta.toFixed(2)),
    },
  });

  // ========================
  // 🧾 DESCRIPCIÓN
  // ========================

  const nombreCalidad = {
    liviana: "liviana",
    reforzada: "reforzada",
    super_reforzada: "súper reforzada",
  };
  let descripcion = "";

  if (tipo === "cajon_block") {
    descripcion = `Cajon Block ${
      material === "pvc" ? "PVC" : "Aluminio"
    } ${ancho}x${alto} blanco - final ${resultado.configuracion.anchoFinal}x${
      resultado.configuracion.altoFinal
    }`;
  }

  if (tipo === "varillas") {
    descripcion = `Varillas PVC ${ancho} cm (${cantidad} varillas - altura ${
      cantidad * 5
    } cm)`;
  }
  if (tipo === "cortina" && material === "pvc") {
    descripcion = `Cortina PVC ${
      construccion === "pano_solo" ? "paño solo" : "completa"
    } ${ancho}x${alto} blanca ${nombreCalidad[calidad] || calidad}`;
  }

  if (tipo === "cortina" && material === "aluminio") {
    const colorTexto = color === "simil_madera" ? "simil madera" : color;

    descripcion = `Cortina Aluminio ${
      construccion === "pano_solo" ? "paño solo" : "completa"
    } ${ancho}x${alto} ${colorTexto}`;
  }

  // ========================
  // 🧠 CONFIG
  // ========================

  const configuracion = {
    tipo,
    material,
    calidad,
    construccion,
    color,
    cantidad,
    ancho,
    alto: tipo === "varillas" ? cantidad * 5 : alto,

    anchoFinal: resultado.configuracion.anchoFinal,

    altoFinal: resultado.configuracion.altoFinal,

    svg: null,
  };

  // ========================
  // ✅ RESPONSE
  // ========================

  return buildWrapperResponse({
    modulo: "cortinas",

    linea: tipo === "cajon_block" ? "cajon_block" : material,

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

    margenAplicado: Math.round(perfilData.ganancia * 100),

    ganancia: venta - costoFinal,

    items,

    descripcion,

    configuracion,

    audit: audit.getSteps(),
  });
}

module.exports = calcularCortinasWrapper;
