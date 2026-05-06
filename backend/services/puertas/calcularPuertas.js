const { fromRoot } = require("../../utils/path");

const superficies = require(
  fromRoot("frontend/data/productos/superficies.json"),
);

// ========================
// 🧠 HELPERS
// ========================

function normalizar(txt) {
  return txt?.toString().toLowerCase().trim();
}

function buscarModelo(obj, nombre) {
  return Object.entries(obj || {}).find(
    ([key]) => normalizar(key) === normalizar(nombre),
  )?.[1];
}

// ========================
// 🪟 VIDRIOS
// ========================

function calcularVidrio(producto, tipoVidrio) {
  if (!tipoVidrio) {
    return 0;
  }

  // ========================
  // DVH CLÁSICO
  // ========================

  if (tipoVidrio === "dvh") {
    const vidrio4 = producto.vidrios?.["4mm"] || 0;

    const camara = producto.camara || 0;

    return vidrio4 * 2 + camara;
  }

  // ========================
  // DVH 5+9+5
  // ========================

  if (tipoVidrio === "dvh_5_9_5") {
    const vidrio5 = superficies.vidrios?.["5mm"] || 0;

    const camara = superficies.vidrios?.["dvh"] || 0;

    return vidrio5 * 2 + camara;
  }

  // ========================
  // LAMINADO
  // ========================

  if (tipoVidrio === "4+4") {
    return superficies.vidrios?.["4+4"] || 0;
  }

  // ========================
  // STANDARD
  // ========================

  return producto.vidrios?.[tipoVidrio] || 0;
}

// ========================
// 🚀 MAIN
// ========================

function calcularPuertas(dataInput) {
  const {
    tipo = "simple",
    linea,
    modelo,
    modeloPuerta,
    modeloMedia,
    tipoVidrio,
  } = dataInput;

  const data = require(
    fromRoot(`frontend/data/productos/puertas_${linea}.json`),
  );

  const items = [];

  let estructura = 0;

  let vidrioTotal = 0;

  let hojas = tipo === "doble" ? 2 : 1;

  // ========================
  // 🚪 PUERTA Y MEDIA
  // ========================

  if (tipo === "puerta_y_media") {
    const puerta = buscarModelo(data.modelos, modeloPuerta);

    const media = buscarModelo(data.modelos, modeloMedia);

    if (!puerta || !media) {
      throw new Error("Modelo puerta/media inválido");
    }

    estructura += puerta.base + media.base;

    const v1 = calcularVidrio(puerta, tipoVidrio);

    const v2 = calcularVidrio(media, tipoVidrio);

    vidrioTotal += v1 + v2;

    items.push(
      {
        tipo: "estructura",
        descripcion: modeloPuerta,
        precio: Math.round(puerta.base),
      },

      {
        tipo: "vidrio",
        descripcion: tipoVidrio,
        precio: Math.round(v1),
      },

      {
        tipo: "estructura",
        descripcion: modeloMedia,
        precio: Math.round(media.base),
      },

      {
        tipo: "vidrio",
        descripcion: tipoVidrio,
        precio: Math.round(v2),
      },
    );

    hojas = 2;
  }

  // ========================
  // 🚪 SIMPLE / DOBLE
  // ========================
  else {
    const producto = buscarModelo(data.modelos, modelo);

    if (!producto) {
      throw new Error("Modelo no encontrado");
    }

    estructura = producto.base * hojas;

    vidrioTotal = calcularVidrio(producto, tipoVidrio) * hojas;

    items.push(
      {
        tipo: "estructura",
        descripcion: modelo,
        precio: Math.round(estructura),
      },

      {
        tipo: "vidrio",
        descripcion: tipoVidrio,
        precio: Math.round(vidrioTotal),
      },
    );
  }

  // ========================
  // 💰 TOTAL
  // ========================

  const costoBase = estructura + vidrioTotal;

  return {
    costoBase: Math.round(costoBase),

    items,

    descripcionBase: `Puerta ${linea}`,

    configuracion: {
      tipo,

      hojas,

      linea,

      tipoVidrio,
    },
  };
}

module.exports = calcularPuertas;
