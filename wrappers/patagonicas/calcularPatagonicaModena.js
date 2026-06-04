const { fromRoot } = require("../../backend/utils/path");

const service = require(
  fromRoot("services/patagonicas/calcularPatagonicaModena"),
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

    color = "blanco",

    perfil = "amarilla",

    ladoApertura = "derecha",

    tipoApertura = "abrir",

    premarco = false,
    contramarco = false,
    mosquitero = false,
    guia = false,
    cortina = null,
    cajonBlock = false,
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
  // =========================
  // ✅ VALIDACIONES EXTRAS
  // =========================

  if (cajonBlock && guia) {
    throw new Error("No puede llevar guía y cajón block juntos");
  }

  if (!guia && cortina) {
    throw new Error("Sin guía no puede llevar cortina");
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

  let costoBase = items.reduce((acc, i) => acc + Number(i.precio || 0), 0);

  const m2 = (anchoFinal * altoFinal) / 10000;

  const ml = (anchoFinal * 2 + altoFinal * 2) / 100;

  // =========================
  // 🧵 MOSQUITERO
  // =========================

  if (mosquitero) {
    const c = Number(superficies.superficies.mosquitero_fijo || 0) * m2;

    costoBase += c;

    items.push({
      tipo: "mosquitero",
      precio: Math.round(c),
    });
  }

  // =========================
  // 🪚 PREMARCO
  // =========================

  if (premarco) {
    const c = Number(superficies.superficies.premarco || 0) * ml;

    costoBase += c;

    items.push({
      tipo: "premarco",
      precio: Math.round(c),
    });
  }

  // =========================
  // 🪚 CONTRAMARCO
  // =========================

  if (premarco || contramarco) {
    const c = Number(superficies.superficies.contramarco || 0) * ml;

    costoBase += c;

    items.push({
      tipo: "contramarco",
      precio: Math.round(c),
    });
  }

  // =========================
  // 📏 GUIA
  // =========================

  if (guia) {
    const c = Number(superficies.superficies.guia || 0) * m2;

    costoBase += c;

    items.push({
      tipo: "guia",
      precio: Math.round(c),
    });
  }

  // =========================
  // 🪟 CORTINAS
  // =========================

  if (cortina === "pvc") {
    const c = Number(superficies.superficies.cortinas?.pvc || 0) * m2;

    costoBase += c;

    items.push({
      tipo: "cortina_pvc",
      precio: Math.round(c),
    });
  }

  if (cortina === "aluminio") {
    const c = Number(superficies.superficies.cortinas?.aluminio || 0) * m2;

    costoBase += c;

    items.push({
      tipo: "cortina_aluminio",
      precio: Math.round(c),
    });
  }

  // =========================
  // 📦 CAJON BLOCK
  // =========================

  if (cajonBlock) {
    const c = Number(superficies.superficies.cajon_block || 0);

    costoBase += c;

    items.push({
      tipo: "cajon_block",
      precio: Math.round(c),
    });
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

  return {
    costoBase: Math.round(costoBase),

    costo: Math.round(costo),

    precioProveedor: Math.round(proveedor),

    precioVenta: Math.round(venta),

    precioFinal: Math.round(venta),

    ganancia: Math.round(venta - costo),

    items,

    descripcion: `Patagónica Modena ${medidaFinal}`,

    configuracion,
  };
}

module.exports = calcularWrapper;
