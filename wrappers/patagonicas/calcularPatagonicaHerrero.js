const { fromRoot } = require("../../backend/utils/path");

console.log("🔥 WRAPPER HERRERO NUEVO");

const calcularRajaHerrero = require(
  fromRoot("wrappers/rajas/calcularRajaHerrero"),
);

const calcularSuperficie = require(
  fromRoot("wrappers/superficies/calcularSuperficies"),
);

const perfiles = require(fromRoot("config/perfiles"));

const { buildPatagonicaSVG } = require(fromRoot("utils/svg"));

// =========================
// 🚀 WRAPPER
// =========================

function calcularWrapper(data) {
  const {
    medidaTotal,

    tipo,

    color = "blanco",

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

  console.log("DEBUG HERRERO:", {
    ancho,
    alto,
    anchoRajaFinal,
    cantidadRajas,
    anchoTotalRajas,
    anchoFijo,
    linea,
    lineaNormalizada,
  });

  if (anchoFijo <= 0 || isNaN(anchoFijo)) {
    throw new Error("Ancho fijo inválido");
  }

  // =========================
  // 🪟 RAJAS
  // =========================

  let totalRajas = 0;

  const items = [];

  for (let i = 0; i < cantidadRajas; i++) {
    const raja = calcularRajaHerrero({
      ancho: anchoRajaFinal,

      alto: Number(alto),

      color,

      tipoVidrio,
    });

    console.log("RAJA:", raja);

    totalRajas += Number(raja?.costoBase || 0);

    items.push({
      tipo: "raja",

      precio: Math.round(Number(raja?.costoBase || 0)),
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
    console.log("ANTES SUPERFICIE");

    fijo = calcularSuperficie({
      tipo: "pano-fijo",

      ancho: Number(anchoFijo),

      alto: Number(alto),

      linea: lineaNormalizada,

      color,

      tipoVidrio,

      perfil,
    });

    console.log("DESPUES SUPERFICIE", fijo);
    items.push({
      tipo: "pano-fijo",
      precio: Math.round(Number(fijo?.costoBase || 0)),
    });
  } catch (err) {
    console.error("ERROR SUPERFICIE:", err);
  }

  // =========================
  // 💰 COSTO BASE
  // =========================

  const costoBase = Number(totalRajas || 0) + Number(fijo?.costoBase || 0);

  // =========================
  // 💰 PERFIL
  // =========================

  console.log("PERFIL:", perfil);

  console.log("LINEA NORMALIZADA:", lineaNormalizada);

  console.log("PERFILES DISPONIBLES:", perfiles?.[perfil]);

  const perfilData = perfiles?.[perfil]?.[lineaNormalizada] ||
    perfiles?.amarilla?.[lineaNormalizada] || {
      descuento: 0,

      flete: 0,

      ganancia: 0.35,
    };

  console.log("PERFIL DATA:", perfilData);

  const costo = costoBase * (1 - Number(perfilData.descuento || 0));

  const proveedor = costo * (1 + Number(perfilData.flete || 0));

  const venta = proveedor * (1 + Number(perfilData.ganancia || 0));

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

    descripcion: `Patagónica Herrero ${medidaTotal}`,

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
  };
}

module.exports = calcularWrapper;
