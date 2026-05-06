const { fromRoot } = require("../../utils/path");

const colores = require(fromRoot("frontend/data/colores.json"));

function normalizar(txt) {
  return txt?.toString().toLowerCase().trim();
}

function buscarModelo(obj, nombre) {
  return Object.entries(obj || {}).find(
    ([key]) => normalizar(key) === normalizar(nombre),
  )?.[1];
}

function getColorFactor(color) {
  const c = colores.find((x) => normalizar(x.nombre) === normalizar(color));
  return c ? c.valor : 0;
}

function calcularPuertas(dataInput) {
  const {
    tipo = "simple",
    linea,
    modelo,
    modeloPuerta,
    modeloMedia,
    medida,
    color,
    tipoVidrio,
  } = dataInput;

  const data = require(
    fromRoot(`frontend/data/productos/puertas_${linea}.json`),
  );

  const items = [];
  let baseSolo = 0;
  let vidrioTotal = 0;
  let hojas = tipo === "doble" ? 2 : 1;

  if (tipo === "puerta_y_media") {
    const puerta = buscarModelo(data.modelos, modeloPuerta);
    const media = buscarModelo(data.modelos, modeloMedia);

    if (!puerta || !media) {
      throw new Error("Modelo puerta/media inválido");
    }

    baseSolo += puerta.base + media.base;

    const v1 = puerta.vidrios?.[tipoVidrio] || 0;
    const v2 = media.vidrios?.[tipoVidrio] || 0;

    vidrioTotal += v1 + v2;

    items.push(
      { tipo: "base", descripcion: modeloPuerta, precio: puerta.base },
      { tipo: "vidrio", descripcion: tipoVidrio, precio: v1 },
      { tipo: "base", descripcion: modeloMedia, precio: media.base },
      { tipo: "vidrio", descripcion: tipoVidrio, precio: v2 },
    );

    hojas = 2;
  } else {
    const producto = buscarModelo(data.modelos, modelo);

    if (!producto) throw new Error("Modelo no encontrado");

    baseSolo = producto.base * hojas;
    vidrioTotal = (producto.vidrios?.[tipoVidrio] || 0) * hojas;

    items.push(
      { tipo: "base", descripcion: modelo, precio: producto.base },
      {
        tipo: "vidrio",
        descripcion: tipoVidrio,
        precio: producto.vidrios?.[tipoVidrio] || 0,
      },
    );
  }

  // COLOR SOLO SOBRE BASE
  const colorFactor = getColorFactor(color);
  const costoColor = baseSolo * colorFactor;

  if (costoColor > 0) {
    items.push({
      tipo: "color",
      descripcion: color,
      precio: Math.round(costoColor),
    });
  }

  const costoBase = baseSolo + vidrioTotal + costoColor;

  return {
    costoBase: Math.round(costoBase),
    items,
    descripcionBase: `Puerta ${linea}`,
    configuracion: {
      tipo,
      hojas,
      linea,
      color,
      tipoVidrio,
    },
  };
}

module.exports = calcularPuertas;
