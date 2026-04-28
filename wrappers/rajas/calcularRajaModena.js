const { fromRoot } = require("../../backend/utils/path");

const calcularRaja = require(fromRoot("backend/services/rajas/calcularRaja"));

const superficies = require(
  fromRoot("frontend/data/productos/superficies.json"),
);

const perfiles = require(fromRoot("backend/config/perfiles"));
const colores = require(fromRoot("frontend/data/colores.json"));

const data = require(fromRoot("frontend/data/productos/rajas_modena.json"));

// 📐
const calcularM2 = (a, h) => (a * h) / 10000;
const calcularML = (a, h) => (a * 2 + h * 2) / 100;

// 🎨 COLOR
function getColorValor(color) {
  const c = colores.find(
    (x) => x.nombre.toLowerCase().trim() === (color || "").toLowerCase().trim(),
  );
  return c ? c.valor : 0;
}

// 🔍 LOOKUP
function buscarMedidaValida(ancho, alto) {
  const medidas = Object.keys(data.medidas);

  const anchos = [...new Set(medidas.map((m) => +m.split("x")[0]))].sort(
    (a, b) => a - b,
  );
  const altos = [...new Set(medidas.map((m) => +m.split("x")[1]))].sort(
    (a, b) => a - b,
  );

  const a = anchos.find((x) => x >= ancho);
  const h = altos.find((x) => x >= alto);

  if (!a || !h) throw new Error("No hay medida válida");

  return `${a}x${h}`;
}

// 💰 PERFIL
function aplicarPerfil(costo, p) {
  return costo * (1 - p.descuento) * (1 + p.flete) * (1 + p.ganancia);
}

// 🚀
function calcularRajaModena(dataInput) {
  const {
    ancho,
    alto,
    vidrio,
    color,
    mosquitero,
    herrajesBlancos,
    modelo = "raja",
    premarco,
    contramarco,
    perfil = "amarilla",
  } = dataInput;

  if (!ancho || !alto) throw new Error("Faltan medidas");

  if (ancho < 40 || ancho > 100)
    throw new Error("Ancho fuera de rango (40 - 100)");

  if (alto < 40 || alto > 180)
    throw new Error("Alto fuera de rango (40 - 180)");

  // 🔁 regla automática
  let usarContramarco = contramarco;
  if (premarco) usarContramarco = true;

  const medida = buscarMedidaValida(ancho, alto);

  const m2 = calcularM2(ancho, alto);
  const ml = calcularML(ancho, alto);

  const colorValor = getColorValor(color);

  let total = 0;
  const items = [];

  // =========================
  // 🧱 BASE (SIN vidrio especial)
  // =========================

  const vidrioBase = vidrio === "4mm" || vidrio === "3+3" ? vidrio : "4mm";

  const base = calcularRaja({
    medida,
    tipoVidrio: vidrioBase,
    color,
    linea: "modena",
  });

  total += base.costoBase;

  // =========================
  // 🪟 VIDRIOS ESPECIALES
  // =========================

  if (vidrio === "4+4") {
    const costo = superficies.vidrios["4+4"] * m2;
    total = costo;
  }

  if (vidrio === "dvh_5_9_5") {
    const vidrio5 = superficies.vidrios["5+5"] * m2;
    const camara = superficies.vidrios["dvh"] * ml;

    total = vidrio5 * 2 + camara;
  }

  // =========================
  // 🧵 MOSQUITERO
  // =========================

  if (mosquitero) {
    const costo = superficies.superficies.mosquitero_fijo * m2;
    total += costo;

    items.push({ tipo: "mosquitero", precio: Math.round(costo) });
  }

  // =========================
  // 🎨 HERRAJES BLANCOS
  // =========================

  if (herrajesBlancos) {
    total += total * 0.05;
  }

  // =========================
  // 🔧 MODELO
  // =========================

  if (modelo === "oscilobatiente") {
    const costo = superficies.extras.oscilobatiente || 0;
    total += costo;

    items.push({ tipo: "oscilobatiente", precio: costo });
  }

  // =========================
  // 🪚 PREMARCO / CONTRAMARCO
  // =========================

  if (premarco) {
    const costo = superficies.superficies.premarco * ml;
    total += costo;

    items.push({ tipo: "premarco", precio: Math.round(costo) });
  }

  if (usarContramarco) {
    const baseC = superficies.superficies.contramarco * ml;
    const costo = baseC * (1 + colorValor);

    total += costo;

    items.push({ tipo: "contramarco", precio: Math.round(costo) });
  }

  // =========================
  // 📏 ALTURA
  // =========================

  if (alto > 150) {
    total *= 1.3;
  }

  // =========================
  // 💰 PERFIL
  // =========================

  const perfilData = perfiles[perfil]?.modena || perfiles.amarilla.modena;
  const totalVenta = aplicarPerfil(total, perfilData);

  // =========================
  // 🧾 DESCRIPCIÓN
  // =========================

  let descripcion = `Raja Modena ${ancho}x${alto} aluminio ${color}`;

  if (vidrio) descripcion += ` vidrio ${vidrio}`;
  if (mosquitero) descripcion += ` con mosquitero`;
  if (modelo !== "raja") descripcion += ` ${modelo}`;
  if (premarco) descripcion += ` con premarco`;
  if (usarContramarco) descripcion += ` con contramarco`;

  return {
    total: Math.round(totalVenta),
    medidaUsada: medida,
    descripcion,
    items,
  };
}

module.exports = calcularRajaModena;
