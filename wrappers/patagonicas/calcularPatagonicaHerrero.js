const { fromRoot } = require("../../backend/utils/path");

const calcularRajaHerrero = require(
  fromRoot("wrappers/rajas/calcularRajaHerrero"),
);

const superficies = require(
  fromRoot("backend/data/productos/superficies.json"),
);

const calcularMosquiteroFijo = require(
  fromRoot("wrappers/mosquiteros/calcularMosquiteroFijo"),
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

    premarco = false,
    contramarco = false,
    mosquitero = false,
    guia = false,
    cortina = null,
    cajonBlock = false,
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
  // ✅ VALIDACIONES EXTRAS
  // =========================

  if (cajonBlock && guia) {
    throw new Error("No puede llevar guía y cajón block juntos");
  }

  if (!guia && cortina) {
    throw new Error("Sin guía no puede llevar cortina");
  }
  // =========================
  // ⚙️ CONFIG
  // =========================

  const cantidadRajas = tipo === "2_rajas" ? 2 : 1;

  const anchoRajaFinal = Number(anchoRaja);

  const anchoTotalRajas = anchoRajaFinal * cantidadRajas;

  const anchoFijo = ancho - anchoTotalRajas;

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
    fijo = calcularSuperficie({
      tipo: "pano_fijo",

      ancho: Number(anchoFijo),

      alto: Number(alto),

      linea: lineaNormalizada,

      color,

      tipoVidrio,

      perfil,
    });

    items.push({
      tipo: "pano_fijo",
      precio: Math.round(Number(fijo?.costoBase || 0)),
    });
  } catch (err) {
    console.error("ERROR SUPERFICIE:", err);
  }

  // =========================
  // ➕ EXTRAS
  // =========================

  let extras = 0;

  // =========================
  // 🦟 MOSQUITERO
  // =========================

  if (mosquitero) {
    const mosca = calcularMosquiteroFijo({
      ancho,
      alto,
      color,
      perfil,
    });

    extras += Number(mosca?.costoBase || 0);

    items.push({
      tipo: "mosquitero",
      precio: Math.round(Number(mosca?.costoBase || 0)),
    });
  }

  // =========================
  // 🛤 GUIA
  // =========================

  if (guia) {
    const m2 = (ancho * alto) / 10000;

    const costoGuia = m2 * Number(superficies.superficies.guia || 0);

    extras += costoGuia;

    items.push({
      tipo: "guia",
      precio: Math.round(costoGuia),
    });
  }

  // =========================
  // 🪟 CORTINA PVC
  // =========================

  if (cortina === "pvc") {
    const m2 = (ancho * alto) / 10000;

    const costo = m2 * Number(superficies.superficies.cortinas?.pvc || 0);

    extras += costo;

    items.push({
      tipo: "cortina_pvc",
      precio: Math.round(costo),
    });
  }

  // =========================
  // 🪟 CORTINA ALUMINIO
  // =========================

  if (cortina === "aluminio") {
    const m2 = (ancho * alto) / 10000;

    const costo = m2 * Number(superficies.superficies.cortinas?.aluminio || 0);

    extras += costo;

    items.push({
      tipo: "cortina_aluminio",
      precio: Math.round(costo),
    });
  }

  // =========================
  // 📦 CAJON BLOCK
  // =========================

  if (cajonBlock) {
    const costo = Number(superficies.superficies.cajon_block || 0);

    extras += costo;

    items.push({
      tipo: "cajon_block",
      precio: Math.round(costo),
    });
  }

  // =========================
  // 💰 COSTO BASE
  // =========================

  const costoBase =
    Number(totalRajas || 0) +
    Number(fijo?.costoBase || 0) +
    Number(extras || 0);

  // =========================
  // 💰 PERFIL
  // =========================

  const perfilData = perfiles?.[perfil]?.[lineaNormalizada] ||
    perfiles?.amarilla?.[lineaNormalizada] || {
      descuento: 0,

      flete: 0,

      ganancia: 0.35,
    };

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
