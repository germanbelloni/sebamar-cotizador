const { fromRoot } = require("../../utils/path");

const calcularPuertas = require(
  fromRoot("backend/services/puertas/calcularPuertas"),
);
const superficies = require(
  fromRoot("frontend/data/productos/superficies.json"),
);

// =========================
// HELPERS
// =========================

function validarHojas(ancho, hojas) {
  if (ancho <= 270) {
    if (![3, 4].includes(hojas)) {
      throw new Error("Para ese ancho solo 3 o 4 hojas");
    }
  } else {
    if (![4, 5].includes(hojas)) {
      throw new Error("Para ese ancho solo 4 o 5 hojas");
    }
  }
}

function validarAltura(tipo, alto) {
  if (tipo === "abrir" && alto > 205) {
    throw new Error("Portón de abrir no puede superar 205 de alto");
  }

  if ((tipo === "corredizo" || tipo === "plegadizo") && alto > 230) {
    throw new Error("Altura máxima 230 para este tipo");
  }
}

function getRecargoAltura(alto) {
  if (alto > 210) return 0.1;
  if (alto > 205) return 0.05;
  return 0;
}

function validarApertura(tipo, apertura) {
  const abrir = [
    "izquierda_izquierda",
    "centro_izquierda",
    "centro_derecha",
    "derecha_derecha",
  ];

  const plegado = ["izquierda_izquierda", "derecha_derecha"];

  const corredizo = ["izquierda_derecha", "derecha_izquierda"];

  if (tipo === "abrir" && !abrir.includes(apertura)) {
    throw new Error("Apertura inválida para abrir");
  }

  if (tipo === "plegadizo" && !plegado.includes(apertura)) {
    throw new Error("Apertura inválida para plegadizo");
  }

  if (tipo === "corredizo" && !corredizo.includes(apertura)) {
    throw new Error("Apertura inválida para corredizo");
  }
}

// =========================
// MAIN
// =========================

function calcularPortones(dataInput) {
  const {
    ancho,
    alto,
    hojas,
    tipo = "abrir",
    modelo,
    linea,
    color,
    tipoVidrio,
    apertura,
  } = dataInput;

  if (!ancho || !alto || !hojas) {
    throw new Error("Faltan datos");
  }

  if (ancho < 200 || ancho > 360) {
    throw new Error("Ancho fuera de rango");
  }

  if (alto < 200) {
    throw new Error("Altura mínima 200");
  }

  validarHojas(ancho, hojas);
  validarAltura(tipo, alto);
  validarApertura(tipo, apertura);

  const anchoHoja = ancho / hojas;

  let costoTotal = 0;

  for (let i = 0; i < hojas; i++) {
    const hoja = calcularPuertas({
      tipo: "simple",
      linea,
      modelo,
      medida: `${Math.round(anchoHoja)}x${alto}`,
      color,
      tipoVidrio,
    });

    costoTotal += hoja.costo;
  }

  // 🔧 herrajes
  if (tipo === "corredizo") {
    costoTotal += superficies.herrajes?.corredizo || 0;
  }

  if (tipo === "plegadizo") {
    costoTotal += superficies.herrajes?.plegadizo || 0;
  }

  // 📈 recargo altura
  const recargo = getRecargoAltura(alto);
  costoTotal *= 1 + recargo;

  return {
    costo: Math.round(costoTotal),
    hojas,
    anchoHoja: Math.round(anchoHoja),
  };
}

module.exports = calcularPortones;
