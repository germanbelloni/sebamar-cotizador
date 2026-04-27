const { fromRoot } = require("../../utils/path");

const calcularRaja = require(fromRoot("services/rajas/calcularRaja"));
const superficies = require(
  fromRoot("frontend/data/productos/superficies.json"),
);
const perfiles = require(fromRoot("config/perfiles"));

// 📐 m²
function calcularM2(ancho, alto) {
  return (ancho * alto) / 10000;
}

// 🔍 LOOKUP POR EJES (CLAVE DEL SISTEMA)
function buscarMedidaValida(ancho, alto, data) {
  const medidas = Object.keys(data.medidas);

  const anchos = [...new Set(medidas.map((m) => Number(m.split("x")[0])))];
  const altos = [...new Set(medidas.map((m) => Number(m.split("x")[1])))];

  const anchoValido = anchos.sort((a, b) => a - b).find((a) => a >= ancho);

  const altoValido = altos.sort((a, b) => a - b).find((h) => h >= alto);

  if (!anchoValido || !altoValido) {
    throw new Error(`No hay medida válida superior para ${ancho}x${alto}`);
  }

  return `${anchoValido}x${altoValido}`;
}

function calcularRajaModena(dataInput) {
  const {
    ancho,
    alto,
    vidrio,
    color,
    mosquitero,
    herrajesBlancos,
    perfil = "amarilla",
  } = dataInput;

  // =========================
  // 🔒 VALIDACIONES
  // =========================

  if (!ancho || !alto) {
    throw new Error("Faltan ancho o alto");
  }

  if (ancho < 40 || ancho > 100) {
    throw new Error("Ancho fuera de rango (40 - 100)");
  }

  if (alto < 40 || alto > 150) {
    throw new Error("Alto fuera de rango (40 - 150)");
  }

  // =========================
  // 📦 DATA
  // =========================

  const data = require(fromRoot("frontend/data/productos/rajas_modena.json"));

  // =========================
  // 🔍 LOOKUP
  // =========================

  const medida = buscarMedidaValida(ancho, alto, data);

  // =========================
  // 🔹 BASE (service)
  // =========================

  const baseResult = calcularRaja({
    medida,
    tipoVidrio: vidrio === "4mm" || vidrio === "3+3" ? vidrio : "4mm",
    color,
    perfil,
    linea: "modena",
  });

  let total = baseResult.total;

  const perfilData = perfiles[perfil]?.modena || perfiles["amarilla"].modena;

  const m2 = calcularM2(ancho, alto);

  // =========================
  // 🪟 VIDRIOS ESPECIALES
  // =========================

  if (vidrio === "4+4") {
    total += superficies.vidrios["4+4"] * m2;
  }

  if (vidrio === "dvh_5_9_5") {
    const vidrioPrecio = superficies.vidrios["5+5"];
    const camara = superficies.vidrios["dvh_camara"];

    total += (vidrioPrecio * 2 + camara) * m2;
  }

  // =========================
  // 🧵 MOSQUITERO
  // =========================

  if (mosquitero) {
    total += superficies.mosquitero_fijo * m2;
  }

  // =========================
  // 🎨 HERRAJES BLANCOS
  // =========================

  if (herrajesBlancos) {
    total += baseResult.total * 0.05;
  }

  // =========================
  // 💰 PERFIL
  // =========================

  total *= 1 - perfilData.descuento;
  total *= 1 + perfilData.flete;
  total *= 1 + perfilData.ganancia;

  // =========================
  // 🧾 DESCRIPCIÓN
  // =========================

  let descripcion = `Raja Módena ${ancho}x${alto} aluminio ${color}`;

  if (vidrio) descripcion += ` vidrio ${vidrio}`;
  if (mosquitero) descripcion += ` con mosquitero`;
  if (herrajesBlancos) descripcion += ` herrajes blancos`;

  return {
    total: Math.round(total),
    medidaUsada: medida,
    descripcion,
  };
}

module.exports = calcularRajaModena;
