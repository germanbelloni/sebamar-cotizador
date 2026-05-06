const { fromRoot } = require("../../backend/utils/path");

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
    raja,
  } = data;

  if (!medidaTotal) {
    throw new Error("Falta medida");
  }

  const [ancho, alto] = medidaTotal.split("x").map(Number);

  // =========================
  // CONFIGURACION
  // =========================

  const cantidadRajas = tipo === "2_rajas" ? 2 : 1;

  const anchoRaja = raja?.ancho || 50;

  const anchoTotalRajas = anchoRaja * cantidadRajas;

  const anchoFijo = ancho - anchoTotalRajas;

  if (anchoFijo <= 0) {
    throw new Error("Ancho fijo inválido");
  }

  // =========================
  // 🪟 RAJAS
  // =========================

  let totalRajas = 0;

  let items = [];

  for (let i = 0; i < cantidadRajas; i++) {
    const r = calcularRajaHerrero({
      ancho: anchoRaja,
      alto,
      color,
      tipoVidrio: raja?.tipoVidrio || "4mm",
    });

    totalRajas += r.costoBase;

    items.push({
      tipo: "raja",
      precio: r.costoBase,
    });
  }

  // =========================
  // 🪟 PAÑO FIJO
  // =========================

  const fijo = calcularSuperficie({
    tipo: "pano_fijo",
    ancho: anchoFijo,
    alto,
    linea: "herrero",
    color,
    tipoVidrio: raja?.tipoVidrio || "4mm",
    perfil,
  });

  items.push({
    tipo: "pano_fijo",
    precio: fijo.costoBase,
  });

  // =========================
  // 💰 TOTAL
  // =========================

  const costoBase = totalRajas + fijo.costoBase;

  const perfilData = perfiles[perfil]?.herrero || perfiles.amarilla.herrero;

  const costo = costoBase * (1 - perfilData.descuento);

  const proveedor = costo * (1 + perfilData.flete);

  const venta = proveedor * (1 + perfilData.ganancia);

  // =========================
  // ✅ RESPONSE
  // =========================

  return {
    costoBase: Math.round(costoBase),

    costo: Math.round(costo),

    precioProveedor: Math.round(proveedor),

    precioVenta: Math.round(venta),

    ganancia: Math.round(venta - costo),

    items: items.map((i) => ({
      tipo: i.tipo,
      precio: Math.round(i.precio || 0),
    })),

    descripcion: `Patagónica Herrero ${medidaTotal}`,

    configuracion: {
      medidaTotal,

      tipo,

      color,

      cantidadRajas,

      anchoRaja,

      anchoFijo,

      svg: buildPatagonicaSVG({
        cantidadRajas,

        ladoApertura,

        tipoApertura,
      }),
    },
  };
}

module.exports = calcularWrapper;
