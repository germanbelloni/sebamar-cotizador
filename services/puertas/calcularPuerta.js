const fs = require("fs");
const path = require("path");
const colores = require("../../data/colores.json");

function getColorValor(color) {
  const c = colores.find(
    (x) => x.nombre.toLowerCase().trim() === (color || "").toLowerCase().trim(),
  );
  return c ? c.valor : 0;
}

function calcularPuerta(dataInput) {
  const { linea, tipo = "simple" } = dataInput;

  let filePath;

  if (linea === "herrero") {
    filePath = "data/productos/puertas_herrero.json";
  }

  if (linea === "modena") {
    filePath = "data/productos/puertas_modena.json";
  }

  if (linea === "eco") {
    filePath = "data/productos/puertas_eco.json";
  }

  const data = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), filePath), "utf-8"),
  );

  let total = 0;

  // =========================
  // 🧱 BASE
  // =========================

  const modeloKey = Object.keys(data.modelos).find(
    (k) => k.toLowerCase().trim() === dataInput.modelo.toLowerCase().trim(),
  );

  const producto = data.modelos[modeloKey];

  if (!producto) throw new Error("Modelo no encontrado");

  total = producto.base || 0;

  // =========================
  // 🎨 COLOR (SOLO BASE)
  // =========================

  const colorValor = getColorValor(dataInput.color);
  total = total * (1 + colorValor);

  // =========================
  // 🪟 VIDRIO
  // =========================

  if (linea === "herrero") {
    if (!producto.sinVidrio && dataInput.tipoVidrio) {
      total += producto.vidrios[dataInput.tipoVidrio] || 0;
    }
  }

  if (linea === "modena") {
    if (dataInput.vidrio === "dvh") {
      total += (producto.vidrios["4mm"] || 0) * 2;
      total += producto.dvh?.camara || 0;
    } else {
      total += producto.vidrios[dataInput.vidrio] || 0;
    }
  }

  if (linea === "eco") {
    total += producto.vidrios[dataInput.vidrio] || 0;
  }

  // =========================
  // 📏 TAMAÑO (solo herrero)
  // =========================

  if (linea === "herrero") {
    const ajuste = data.ajustes[dataInput.tamano] || 0;
    total = total * (1 + ajuste);
  }

  // =========================
  // ➕ ADICIONALES
  // =========================

  const adicionales = dataInput.adicionales || [];

  adicionales.forEach((a) => {
    const key = a.toLowerCase().replace(/\s+/g, "_");
    total += data.adicionales?.[key] || 0;
  });

  // =========================
  // 💰 REGLAS
  // =========================

  const descuento = linea === "modena" ? 0.07 : 0.1;
  const flete = 0.06;
  const ganancia = 0.3;

  total *= 1 - descuento;
  total *= 1 + flete;
  total *= 1 + ganancia;

  total = Math.round(total);

  // =========================
  // 🔁 MULTIPLICADOR
  // =========================

  if (tipo === "doble") total *= 2;
  if (tipo === "porton") total *= 3;

  return {
    total: Math.round(total),
    adicionalesDetalle: {},
  };
}

module.exports = calcularPuerta;
