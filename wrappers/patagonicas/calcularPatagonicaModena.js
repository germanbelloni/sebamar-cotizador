const { fromRoot } = require("../../backend/utils/path");

const service = require(
  fromRoot("services/patagonicas/calcularPatagonicaModena"),
);

const buildWrapperResponse = require(
  fromRoot("backend/utils/buildWrapperResponse"),
);

const perfiles = require(fromRoot("config/perfiles"));

const colores = require(fromRoot("backend/data/colores.json"));

const superficies = require(
  fromRoot("backend/data/productos/superficies.json"),
);

const { buildPatagonicaSVG } = require(fromRoot("utils/svg"));

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
// 🚀 WRAPPER
// =========================

function calcularWrapper(data) {
  let {
    medida,
    ancho,
    alto,

    cantidadRajas = 1,

    tipoVidrio,
    tipoRaja = "raja",

    color = "blanco",

    perfil = "amarilla",

    ladoApertura = "derecha",

    tipoApertura = "abrir",

    herrajesBlancos = false,
  } = data;

  // =========================
  // 📏 NORMALIZAR
  // =========================

  let anchoFinal = ancho;

  let altoFinal = alto;

  if (medida && typeof medida === "string") {
    const clean = medida.trim().toLowerCase();

    if (!clean.includes("x")) {
      throw new Error("Formato de medida inválido");
    }

    const partes = clean.split("x").map(Number);

    if (partes.length !== 2 || partes.some(isNaN)) {
      throw new Error("Medida inválida");
    }

    anchoFinal = partes[0];

    altoFinal = partes[1];
  }

  if (!anchoFinal || !altoFinal) {
    throw new Error("Faltan medidas");
  }

  const medidaFinal = `${anchoFinal}x${altoFinal}`;

  // =========================
  // 🔧 TIPO
  // =========================

  const tipo = cantidadRajas === 2 ? "2_rajas" : "1_raja";

  // =========================
  // 🧠 SERVICE
  // =========================

  const base = service({
    tipo,

    medida: medidaFinal,

    tipoVidrio,
  });

  // =========================
  // 🎨 COLOR
  // =========================

  const colorFactor = getColorFactor(color);

  const items = base.items.map((i) => {
    let precio = Number(i.precio || 0);

    // SOLO estructura lleva color
    if (i.tipo === "estructura") {
      precio *= 1 + colorFactor;
    }

    return {
      ...i,

      precio: Math.round(precio),
    };
  });

  // =========================
  // 💰 COSTO BASE
  // =========================

  let costoBase = items.reduce((acc, i) => acc + Number(i.precio || 0), 0);

  // 🔧 BRAZO
  if (tipoRaja === "brazo") {
    const extra = Number(superficies.extras["brazo_de_empuje"] || 0);

    costoBase += extra;

    items.push({
      tipo: "brazo",
      precio: Math.round(extra),
    });
  }

  // 🔧 VOLCABLE
  if (tipoRaja === "volcable") {
    const extra = Number(superficies.extras.volcable || 0);

    costoBase += extra;

    items.push({
      tipo: "volcable",
      precio: Math.round(extra),
    });
  }

  // 🔧 OSCILOBATIENTE
  if (tipoRaja === "oscilobatiente") {
    const extra = Number(superficies.extras.oscilobatiente || 0);

    costoBase += extra;

    items.push({
      tipo: "oscilobatiente",
      precio: Math.round(extra),
    });
  }

  // ⚪ HERRAJES BLANCOS (solo estructura)
  if (herrajesBlancos) {
    const estructura = items.find((i) => i.tipo === "estructura");

    if (estructura) {
      const mult = Number(superficies.recargos?.herraje_blanco || 1.05);

      const extra = Math.round(estructura.precio * (mult - 1));

      costoBase += extra;

      items.push({
        tipo: "extra",
        descripcion: "Herrajes blancos",
        precio: extra,
      });
    }
  }

  // =========================
  // 💰 PERFIL
  // =========================

  const perfilData = perfiles?.[perfil]?.modena ||
    perfiles?.amarilla?.modena || {
      descuento: 0,

      flete: 0,

      ganancia: 0.35,
    };

  const costo = costoBase * (1 - Number(perfilData.descuento || 0));

  const proveedor = costo * (1 + Number(perfilData.flete || 0));

  const venta = proveedor * (1 + Number(perfilData.ganancia || 0));

  // =========================
  // 🧠 CONFIG
  // =========================

  const configuracion = {
    ancho: anchoFinal,

    alto: altoFinal,

    medida: medidaFinal,

    cantidadRajas,

    tipoRaja,
    herrajesBlancos,

    tipo,

    color,

    tipoVidrio,

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
    costoBase,

    costo,

    proveedor,

    venta,

    perfil,

    perfilData,

    items,

    descripcion: `Patagónica Modena ${medidaFinal}`,

    configuracion,
  });
}

module.exports = calcularWrapper;
