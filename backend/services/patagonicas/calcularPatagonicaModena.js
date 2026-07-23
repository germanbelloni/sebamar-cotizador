const { fromRoot } = require("../../utils/path");

const superficies = require(
  fromRoot("backend/data/productos/superficies.json"),
);

const data = require(
  fromRoot("backend/data/productos/patagonicas_modena.json"),
);

// =========================
// 📏 NORMALIZAR
// =========================

function normalizarMedida(medida) {
  if (!medida) {
    throw new Error("Medida inválida");
  }

  return medida.trim().toLowerCase();
}

// =========================
// 🪟 VIDRIO
// =========================

function calcularVidrio(datos, ancho, alto, tipoVidrio) {
  if (!tipoVidrio) return 0;

  const vidrioNormalizado = String(tipoVidrio).toLowerCase().trim();

  // ✅ DVH 4+9+4: usar los valores de la lista (JSON)
  if (["dvh", "dvh 4+9+4", "dvh_4_9_4"].includes(vidrioNormalizado)) {
    const vidrio4 = Number(datos.vidrios?.["4mm"] || 0);
    const camara = Number(datos.camara || 0);

    return vidrio4 * 2 + camara;
  }

  // ✅ DVH 5+9+5: calcular desde superficies
  if (["dvh 5+9+5", "dvh_5_9_5"].includes(vidrioNormalizado)) {
    const m2 = (ancho * alto) / 10000;
    const ml = ((ancho + alto) * 2) / 100;

    const vidrio5 = superficies.vidrios["5mm"] || 0;
    const camara = superficies.vidrios["dvh"] || 0;

    return m2 * vidrio5 * 2 + ml * camara;
  }

  // ✅ Laminado 4+4: calcular desde superficies
  if (vidrioNormalizado === "4+4") {
    const m2 = (ancho * alto) / 10000;

    return m2 * (superficies.vidrios["4+4"] || 0);
  }

  // ✅ 4mm y 3+3: usar la lista
  return datos.vidrios?.[tipoVidrio] || 0;
}
// =========================
// 🚀 MAIN
// =========================

function calcularPatagonicaModena(dataInput) {
  const { tipo, medida, tipoVidrio } = dataInput;

  if (!tipo) {
    throw new Error("Falta tipo");
  }

  const medidaKey = normalizarMedida(medida);
  const [ancho, alto] = medidaKey.split("x").map(Number);

  if (tipo === "1_raja" && ancho < 80) {
    throw new Error("El ancho mínimo es 80 cm");
  }

  const anchoLookup = tipo === "1_raja" && ancho < 120 ? 120 : ancho;

  const medidas = data.tipos?.[tipo]?.medidas || {};

  let datos = medidas[medidaKey];

  // 🔥 buscar medida superior automática
  if (!datos) {
    const medidasDisponibles = Object.keys(medidas);

    const medidaSuperior = medidasDisponibles
      .map((m) => {
        const [w, h] = m.split("x").map(Number);

        return {
          key: m,
          w,
          h,
        };
      })
      .filter((m) => m.w >= anchoLookup && m.h >= alto)
      .sort((a, b) => {
        if (a.h !== b.h) {
          return a.h - b.h;
        }

        return a.w - b.w;
      })[0]?.key;

    if (!medidaSuperior) {
      throw new Error(`No existe medida superior para ${medidaKey}`);
    }

    datos = medidas[medidaSuperior];

    console.log(
      `⚠️ usando medida superior ${medidaSuperior} para ${medidaKey}`,
    );
  }

  // =========================
  // 🪟 ESTRUCTURA
  // =========================

  const estructura = datos.base || 0;

  // =========================
  // 🪟 VIDRIO
  // =========================

  const vidrio = calcularVidrio(datos, ancho, alto, tipoVidrio);

  // =========================
  // 🧾 ITEMS
  // =========================

  const items = [
    {
      tipo: "estructura",
      precio: Math.round(estructura),
    },

    {
      tipo: "vidrio",
      descripcion: tipoVidrio,
      precio: Math.round(vidrio),
    },
  ];

  // =========================
  // 💰 TOTAL
  // =========================

  const costoBase = estructura + vidrio;

  return {
    costoBase: Math.round(costoBase),

    items,
  };
}

module.exports = calcularPatagonicaModena;
