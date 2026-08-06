const { fromRoot } = require("../../utils/path");

const superficies = require(
  fromRoot("backend/data/productos/superficies.json"),
);
const aplicarAjusteMedidaPuerta = require(
  fromRoot("backend/utils/aplicarAjusteMedidaPuerta"),
);

// ========================
// 🧠 HELPERS
// ========================

function normalizar(txt) {
  return txt
    ?.toString()
    .toLowerCase()
    .replace(/_/g, " ")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
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

    const camara = producto.dvh?.camara || 0;

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
  //process.exit();
  const {
    configuracion,
    tipo,
    linea,
    modelo,
    modeloPuerta,
    modeloMedia,
    modeloMediaPuerta,
    tipoVidrio,
    vidrio,
  } = dataInput;

  const vidrioFinal = tipoVidrio || vidrio;
  const tipoFinal = configuracion || tipo || "simple";

  const modeloFinal = modeloPuerta || modelo;
  const modeloMediaFinal = modeloMediaPuerta || modeloMedia;

  const ruta = fromRoot(`backend/data/productos/puertas_${linea}.json`);

  delete require.cache[require.resolve(ruta)];

  const data = require(ruta);

  console.log("================================");
  console.log("LINEA:", linea);
  console.log("RUTA:", ruta);
  console.log("MODELO:", modeloFinal);
  console.log("MODELO 1 VR JSON:", data.modelos["modelo 1 vr"]?.base);
  console.log("================================");

  const items = [];

  let estructura = 0;

  let vidrioTotal = 0;

  let hojas = 1;

  if (tipoFinal === "doble" || tipoFinal === "puerta_y_media") {
    hojas = 2;
  }

  // ========================
  // 🚪 PUERTA Y MEDIA
  // ========================

  if (tipoFinal === "puerta_y_media") {
    const puerta = buscarModelo(data.modelos, modeloFinal);

    let media = null;

    if (linea === "herrero") {
      if (modeloMediaFinal === "ciega") {
        const modeloCiego = buscarModelo(data.modelos, "modelo 5");

        if (!modeloCiego) {
          throw new Error("Modelo 5 no encontrado para media ciega");
        }

        const factor70 = 0.93;

        media = {
          ...modeloCiego,
          base: Math.round((modeloCiego.base || 0) * factor70),
          vidrios: Object.fromEntries(
            Object.entries(modeloCiego.vidrios || {}).map(([key, value]) => [
              key,
              Math.round(Number(value || 0) * factor70),
            ]),
          ),
          dvh: modeloCiego.dvh
            ? {
                camara: Math.round(
                  Number(modeloCiego.dvh.camara || 0) * factor70,
                ),
              }
            : undefined,
        };
      } else {
        const mediasData = require(
          fromRoot("backend/data/productos/puertas_media_herrero.json"),
        );

        media = buscarModelo(mediasData.medias, modeloMediaFinal);
      }
    } else {
      const factor70 = 0.93; // 70 = 80 - 7%

      media = {
        ...puerta,
        base: Math.round((puerta.base || 0) * factor70),
        vidrios: Object.fromEntries(
          Object.entries(puerta.vidrios || {}).map(([key, value]) => [
            key,
            Math.round(Number(value || 0) * factor70),
          ]),
        ),
        dvh: puerta.dvh
          ? {
              camara: Math.round(Number(puerta.dvh.camara || 0) * factor70),
            }
          : undefined,
      };
    }

    if (!puerta || !media) {
      throw new Error("Modelo puerta/media inválido");
    }

    estructura += puerta.base + media.base;
    const v1 = calcularVidrio(puerta, vidrioFinal);
    const v2 = calcularVidrio(media, vidrioFinal);

    vidrioTotal += v1 + v2;

    items.push(
      {
        tipo: "estructura",
        descripcion: modeloFinal,
        precio: Math.round(puerta.base),
      },

      {
        tipo: "vidrio",
        descripcion: tipoVidrio,
        precio: Math.round(v1),
      },

      {
        tipo: "estructura",
        descripcion: modeloMediaFinal,
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
  // 🚪 SIMPLE / DOBLE / PORTON
  // ========================
  else {
    const producto = buscarModelo(data.modelos, modeloFinal);
    if (!producto) {
      throw new Error(
        `Modelo "${modeloFinal}" no existe para la línea "${linea}".`,
      );
    }

    if (!producto) {
      throw new Error("Modelo no encontrado");
    }

    estructura = producto.base * hojas;

    vidrioTotal = calcularVidrio(producto, vidrioFinal) * hojas;

    console.log("Producto encontrado:", producto);
    console.log("Base:", producto.base);
    console.log("Hojas:", hojas);
    console.log("Estructura:", estructura);

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

  // ========================
  // 📏 AJUSTES MEDIDAS
  // ========================

  aplicarAjusteMedidaPuerta(items, dataInput.ancho, tipoFinal, hojas);

  estructura = items
    .filter((i) => i.tipo === "estructura")
    .reduce((acc, i) => acc + i.precio, 0);

  vidrioTotal = items
    .filter((i) => i.tipo === "vidrio")
    .reduce((acc, i) => acc + i.precio, 0);

  const costoBase = estructura + vidrioTotal;

  return {
    costoBase: Math.round(costoBase),

    precioVenta: Math.round(costoBase),

    items,
    descripcion: `Puerta ${linea}`,
    configuracion: {
      tipo: tipoFinal,

      hojas,

      linea,

      tipoVidrio: vidrioFinal,
    },
  };
}

module.exports = calcularPuertas;
