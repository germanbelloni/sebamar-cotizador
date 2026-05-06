const { fromRoot } = require("../../utils/path");

const colores = require(fromRoot("frontend/data/colores.json"));

const superficies = require(
  fromRoot("frontend/data/productos/superficies.json"),
);

// 📦 DATA (cargar UNA VEZ)
const data = require(
  fromRoot("frontend/data/productos/patagonicas_modena.json"),
);

// 🎨 COLOR
function getColorValor(color) {
  const c = colores.find(
    (x) => x.nombre.toLowerCase().trim() === (color || "").toLowerCase().trim(),
  );
  return c ? c.valor : 0;
}

// 📏 NORMALIZAR MEDIDA
function normalizarMedida(medida) {
  if (!medida) throw new Error("Medida inválida");

  if (medida.includes("x")) {
    const [a, b] = medida.split("x").map(Number);

    if (!a || !b) throw new Error("Medida inválida");

    return `${a}x${b}`;
  }

  return medida.trim().toLowerCase();
}

// 🪟 VIDRIO
function calcularVidrio(datos, ancho, alto, tipoVidrio) {
  if (!tipoVidrio) return 0;

  // DVH clásico
  if (tipoVidrio === "dvh") {
    const vidrio4 = datos.vidrios["4mm"] || 0;
    const camara = datos.camara || 0;
    return vidrio4 * 2 + camara;
  }

  // DVH 5+9+5
  if (tipoVidrio === "dvh_5_9_5") {
    const m2 = (ancho * alto) / 10000;
    const perimetro = ((ancho + alto) * 2) / 100;

    const vidrio5 = superficies.vidrios["5mm"] || 0;
    const camara = superficies.vidrios["dvh"] || 0;

    return m2 * vidrio5 * 2 + perimetro * camara;
  }

  // Laminado 4+4
  if (tipoVidrio === "4+4") {
    const m2 = (ancho * alto) / 10000;
    const valor = superficies.vidrios["4+4"] || 0;
    return m2 * valor;
  }

  // Otros
  return datos.vidrios?.[tipoVidrio] || 0;
}

// 🧠 MAIN
function calcularPatagonicaModena(dataInput) {
  const { tipo, medida, color, tipoVidrio } = dataInput;

  // =========================
  // VALIDACIONES
  // =========================
  if (!tipo) throw new Error("Falta tipo");

  if (!data.tipos?.[tipo]) {
    throw new Error("Tipo inválido");
  }

  const medidaKey = normalizarMedida(medida);

  const datos = data.tipos?.[tipo]?.medidas?.[medidaKey];

  if (!datos) throw new Error("Medida no encontrada");

  const [ancho, alto] = medidaKey.split("x").map(Number);

  const base = datos.base || 0;

  // 🎨 COLOR
  const colorValor = getColorValor(color);
  const baseColor = base * (1 + colorValor);

  // 🪟 VIDRIO
  const vidrio = calcularVidrio(datos, ancho, alto, tipoVidrio);

  const total = baseColor + vidrio;

  return {
    costo: Math.round(total),
    base,
    vidrio,
  };
}

module.exports = calcularPatagonicaModena;
