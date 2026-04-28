const { fromRoot } = require("../../backend/utils/path");

const calcularPostigon = require(
  fromRoot("backend/services/postigones/calcularPostigon"),
);

const superficies = require(
  fromRoot("frontend/data/productos/superficies.json"),
);

const perfiles = require(fromRoot("backend/config/perfiles"));

// 🔍 BUSCAR MEDIDA
function buscarMedidaValida(medidas, ancho, alto) {
  const keys = Object.keys(medidas);

  const validas = keys
    .map((k) => {
      const [a, b] = k.split("x").map(Number);
      return { key: k, ancho: a, alto: b };
    })
    .filter((m) => m.ancho >= ancho && m.alto >= alto)
    .sort((a, b) => a.ancho - b.ancho || a.alto - b.alto);

  return validas[0]?.key;
}

function calcularWrapper(data) {
  let {
    medida,
    ancho,
    alto,
    tipo,
    hojas,
    marco,
    color,
    extras = {},
    ladoApertura,
    perfil = "amarilla",
    linea = "herrero",
  } = data;

  const dataJson = require(fromRoot("frontend/data/productos/postigones.json"));

  // 📏 PARSEO
  if (medida && medida !== "fuera_medida") {
    [ancho, alto] = medida.split("x").map(Number);
  }

  // VALIDACIONES
  if (ancho < 60 || ancho > 240) {
    throw new Error("Ancho fuera de rango");
  }

  if (alto < 60 || alto > 210) {
    throw new Error("Alto fuera de rango");
  }

  const altoOriginal = alto;

  // NORMALIZAR ALTURA PARA LOOKUP
  if (alto > 200) alto = 200;

  const medidaValida = buscarMedidaValida(dataJson.medidas, ancho, alto);

  if (!medidaValida) throw new Error("No hay medida válida");

  // 🧠 SERVICE
  const service = calcularPostigon({
    medida: medidaValida,
    tipo,
    marco,
    color,
  });

  let total = service.total;

  // =========================
  // 🚪 HOJAS
  // =========================

  let hojasFinal = service.hojasBase;

  if (tipo === "corredizo") {
    if (ancho > 149 && hojas === 3) {
      total *= 1.3;
      hojasFinal = 3;
    }
  }

  if (tipo === "abrir") {
    if (ancho > 130) {
      hojasFinal = 3;
    }

    if (ancho > 200 && hojas === 4) {
      total *= 1.4;
      hojasFinal = 4;
    }
  }

  // =========================
  // 📏 ALTURA
  // =========================

  if (altoOriginal > 200 && altoOriginal <= 205) {
    total *= 1.05;
  }

  if (altoOriginal > 205) {
    total *= 1.1;
  }

  // =========================
  // ➕ EXTRAS
  // =========================

  if (extras.microperforado) {
    total *= 1.05;
  }

  if (extras.herrajeBlanco) {
    const mult = superficies.recargos?.herraje_blanco || 1;
    total *= mult;
  }

  // =========================
  // 💰 PERFIL
  // =========================

  const perfilData = perfiles[perfil]?.[linea] || perfiles["amarilla"][linea];

  total *= 1 - perfilData.descuento;
  total *= 1 + perfilData.flete;
  total *= 1 + perfilData.ganancia;

  return {
    total: Math.round(total),
    detalle: {
      tipo,
      hojas: hojasFinal,
      marco,
      medidaValida,
      ancho,
      alto: altoOriginal,
      ladoApertura,
    },
  };
}

module.exports = calcularWrapper;
