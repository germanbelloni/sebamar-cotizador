const { fromRoot } = require("../../utils/path");

const calcularHoja = require("./calcularHoja");

function parseMedida(medida) {
  const [ancho, alto] = medida.split("x").map(Number);
  return { ancho, alto };
}

function getCantidadHojas(tipo) {
  if (tipo === "doble") return 2;
  if (tipo === "porton") return 3;
  return 1;
}

function calcularPuerta(dataInput) {
  const {
    tipo = "simple",
    linea,
    modelo,
    modeloPuerta,
    modeloMedia,
    medida,
    color,
    tipoVidrio,
    adicionales = [],
    perfil = "amarilla",
  } = dataInput;

  const data = require(
    fromRoot(`frontend/data/productos/puertas_${linea}.json`),
  );

  // 🔥 PUERTA + MEDIA
  if (tipo === "puerta_y_media") {
    let productoPuerta;
    let productoMedia;

    if (linea === "herrero") {
      productoPuerta = data.modelos?.[modeloPuerta];
      productoMedia = data.medias?.[modeloMedia];
    }

    if (linea === "modena") {
      productoPuerta = data.modelos?.[modeloPuerta];
      productoMedia = data.modelos?.[modeloMedia];
    }

    if (!productoPuerta) {
      throw new Error("Modelo de puerta no encontrado");
    }

    if (!productoMedia) {
      throw new Error("Modelo de media no encontrado");
    }

    const puerta = calcularHoja({
      producto: productoPuerta,
      linea,
      dataInput: {
        color,
        tipoVidrio,
        vidrio: tipoVidrio,
        adicionales,
      },
      perfil,
    });

    const media = calcularHoja({
      producto: productoMedia,
      linea,
      dataInput: {
        color,
        tipoVidrio,
        vidrio: tipoVidrio,
        adicionales,
      },
      perfil,
    });

    return {
      total: Math.round(puerta + media),
      detalle: {
        puerta,
        media,
      },
      tipo: "puerta_y_media",
      modeloPuerta,
      modeloMedia,
      linea,
    };
  }

  // 🔹 CASO NORMAL

  const { ancho, alto } = parseMedida(medida);

  const cantidadHojas = getCantidadHojas(tipo);

  const anchoHoja = ancho / cantidadHojas;

  const medidaHoja = `${anchoHoja}x${alto}`;

  const ajuste = data.ajustes?.[medidaHoja] || 0;

  const producto = data.modelos?.[modelo];

  if (!producto) {
    throw new Error("Modelo no encontrado");
  }

  let total = 0;

  for (let i = 0; i < cantidadHojas; i++) {
    const hoja = calcularHoja({
      producto,
      linea,
      dataInput: {
        color,
        tipoVidrio,
        vidrio: tipoVidrio,
        ajuste,
        adicionales,
      },
      perfil,
    });

    total += hoja;
  }

  return {
    total: Math.round(total),
    cantidadHojas,
    medidaHoja,
    tipo,
    modelo,
  };
}

module.exports = calcularPuerta;
