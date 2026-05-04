const { fromRoot } = require("../../utils/path");

const colores = require(fromRoot("frontend/data/colores.json"));

// ========================
// 🔧 HELPERS
// ========================
function normalizar(txt) {
  return txt?.toString().toLowerCase().trim();
}

function buscarModelo(obj, nombre) {
  return Object.entries(obj || {}).find(
    ([key]) => normalizar(key) === normalizar(nombre),
  )?.[1];
}

function getColorValor(color) {
  const c = colores.find((x) => normalizar(x.nombre) === normalizar(color));
  return c ? c.valor : 0;
}

function parseMedida(medida) {
  const [ancho, alto] = medida.split("x").map(Number);
  return { ancho, alto };
}

// ========================
// 🧠 MAIN
// ========================
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

  const colorValor = getColorValor(color);

  // =========================
  // 🚪 PUERTA Y MEDIA
  // =========================
  if (tipo === "puerta_y_media") {
    // 🔸 HERRERO
    if (linea === "herrero") {
      const puerta = buscarModelo(data.modelos, modeloPuerta);

      const dataMedias = require(
        fromRoot("frontend/data/productos/puertas_media_herrero.json"),
      );

      let media = buscarModelo(dataMedias.medias, modeloMedia);

      if (!puerta) {
        throw new Error("Modelo de puerta inválido");
      }

      if (!media) {
        const primeraMedia = Object.values(dataMedias.medias || {})[0];

        if (!primeraMedia) {
          throw new Error("No hay medias definidas");
        }

        console.warn("⚠️ Media no encontrada, usando fallback");
        media = primeraMedia;
      }

      let total =
        puerta.base +
        (puerta.vidrios?.[tipoVidrio] || 0) +
        (media.base + (media.vidrios?.[tipoVidrio] || 0));

      total *= 1 + colorValor;

      return {
        costo: Math.round(total),
        hojas: 2,
      };
    }

    // 🔸 MODENA
    if (linea === "modena") {
      const puerta = buscarModelo(data.modelos, modeloPuerta);
      let media = buscarModelo(data.modelos, modeloMedia);

      if (!puerta) {
        throw new Error("Modelo de puerta inválido");
      }

      if (!media) {
        const primeraMedia = Object.values(data.modelos || {})[0];

        if (!primeraMedia) {
          throw new Error("No hay modelos disponibles");
        }

        console.warn("⚠️ Media no encontrada, usando fallback");
        media = primeraMedia;
      }

      let total =
        puerta.base +
        (puerta.vidrios?.[tipoVidrio] || 0) +
        (media.base + (media.vidrios?.[tipoVidrio] || 0));

      total *= 1 + colorValor;

      return {
        costo: Math.round(total),
        hojas: 2,
      };
    }

    // 🔸 ECO (bloqueado)
    throw new Error("Puerta y media no disponible para esta línea");
  }

  // =========================
  // 🚪 SIMPLE / DOBLE
  // =========================

  if (!medida) {
    throw new Error("Falta medida");
  }

  const producto = buscarModelo(data.modelos, modelo);

  if (!producto) {
    throw new Error("Modelo no encontrado");
  }

  let hojas = 1;

  if (tipo === "doble") {
    hojas = 2;
  }

  // 🔹 BASE + VIDRIO
  let base = producto.base + (producto.vidrios?.[tipoVidrio] || 0);

  // 🎨 COLOR
  base *= 1 + colorValor;

  const costo = base * hojas;

  return {
    costo: Math.round(costo),
    hojas,
  };
}

module.exports = calcularPuertas;
