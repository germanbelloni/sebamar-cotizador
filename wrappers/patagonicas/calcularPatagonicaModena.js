const { fromRoot } = require("../../backend/utils/path");

const calcularPatagonicaModena = require(
  fromRoot("backend/services/patagonicas/calcularPatagonicaModena"),
);

const dataSuperficies = require(
  fromRoot("frontend/data/productos/superficies.json"),
);

const perfiles = require(fromRoot("backend/config/perfiles"));

// 🔍 BUSCAR MEDIDA SUPERIOR
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
    cantidadRajas,
    tipoRaja,
    tipoApertura,
    tipoVidrio,
    color,
    extras = {},
    perfil = "amarilla",
  } = data;

  const dataJson = require(
    fromRoot("frontend/data/productos/patagonicas_modena.json"),
  );

  // 📏 PARSEO MEDIDA
  if (medida && medida !== "fuera_medida") {
    [ancho, alto] = medida.split("x").map(Number);
  }

  if (!ancho || !alto) {
    throw new Error("Faltan dimensiones");
  }

  // 🔧 GUARDAR ORIGINAL
  const altoOriginal = alto;

  // 🔧 NORMALIZAR PARA LOOKUP
  if (alto > 150) {
    alto = 150;
  }

  // ❌ VALIDACION
  if (cantidadRajas === 2 && ancho <= 150) {
    throw new Error("No puede tener 2 rajas con ese ancho");
  }

  // 🔧 TIPO
  const tipo = cantidadRajas === 2 ? "2_rajas" : "1_raja";

  // 🔧 ANCHO LOOKUP
  const anchoLookup = cantidadRajas === 2 ? 200 : ancho;

  const medidas = dataJson.tipos?.[tipo]?.medidas;

  if (!medidas) {
    throw new Error("Tipo inválido");
  }

  const medidaValida = buscarMedidaValida(medidas, anchoLookup, alto);

  if (!medidaValida) {
    throw new Error("No hay medida válida");
  }

  // 🧠 SERVICE
  const service = calcularPatagonicaModena({
    tipo,
    medida: medidaValida,
    color,
    tipoVidrio,
  });

  let total = service.total;

  // 📏 ALTURA >150
  if (altoOriginal > 150) {
    total *= 1.3;
  }

  // 🪟 MOSQUITERO
  if (extras.mosquitero) {
    const m2 = (tipoRaja * altoOriginal) / 10000;

    const valorMosq = dataSuperficies.superficies["mosquitero_fijo"] || 0;

    let precio = m2 * valorMosq;

    if (cantidadRajas === 2) {
      precio *= 2;
    }

    total += precio;
  }

  // 📦 VALIDACION GUIA / CAJON
  if (extras.cajonBlock && extras.guia) {
    throw new Error("No se puede guia y cajon block juntos");
  }

  // 📦 CAJON BLOCK
  if (extras.cajonBlock) {
    const m2 = (ancho * altoOriginal) / 10000;

    const valorCajon = dataSuperficies.superficies["cajon_block"] || 0;

    total += m2 * valorCajon;
  }

  // 🔧 APERTURA
  if (tipoApertura === "oscilobatiente") {
    const valorOsc = dataSuperficies.extras["oscilobatiente"] || 0;

    total += valorOsc;
  }

  // 💰 PERFIL
  const perfilData = perfiles[perfil]?.modena || perfiles["amarilla"].modena;

  total *= 1 - perfilData.descuento;
  total *= 1 + perfilData.flete;
  total *= 1 + perfilData.ganancia;

  return {
    total: Math.round(total),
    detalle: {
      tipo,
      medidaValida,
      cantidadRajas,
      ancho,
      alto: altoOriginal,
    },
  };
}

module.exports = calcularWrapper;
