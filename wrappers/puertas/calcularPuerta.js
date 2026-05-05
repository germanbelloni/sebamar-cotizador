const { fromRoot } = require("../../backend/utils/path");

const calcularPuertas = require(
  fromRoot("backend/services/puertas/calcularPuertas"),
);

const calcularRaja = require(fromRoot("backend/services/rajas/calcularRaja"));

const calcularVentana = require(
  fromRoot("backend/services/ventanas/calcularVentana"),
);

const superficies = require(
  fromRoot("frontend/data/productos/superficies.json"),
);

const perfiles = require(fromRoot("backend/config/perfiles"));

// ========================
// 🚀 WRAPPER
// ========================
function calcularPuertaWrapper(dataInput) {
  if (!dataInput.medida && dataInput.ancho && dataInput.alto) {
    dataInput.medida = `${dataInput.ancho}x${dataInput.alto}`;
  }

  const {
    perfil = "amarilla",
    raja,
    ventana,
    extras = {},
    color,
    linea,
  } = dataInput;

  // ========================
  // 🚪 BASE
  // ========================
  const base = calcularPuertas(dataInput);

  let costo = base.costo || 0;

  const items = [];

  // ========================
  // 🪟 RAJA
  // ========================
  if (raja && raja.ancho && raja.alto) {
    const r = calcularRaja({
      medida: `${raja.ancho}x${raja.alto}`,
      color,
      tipoVidrio: raja.tipoVidrio || "3+3",
      modelo: "4",
      linea,
    });

    const costoRaja = r.costoBase || r.total || 0;

    costo += costoRaja;

    items.push({
      tipo: "raja",
      precio: Math.round(costoRaja),
    });
  }

  // ========================
  // 🪟 VENTANA
  // ========================
  if (ventana) {
    const v = calcularVentana({
      linea,
      medida: "60x40",
      color,
      tipoVidrio: "3mm",
    });

    const costoVentana = v.costoBase || 0;

    costo += costoVentana;

    items.push({
      tipo: "ventana",
      precio: Math.round(costoVentana),
    });
  }

  // ========================
  // ➕ EXTRAS
  // ========================
  if (extras.barralRecto) {
    const valor = superficies.herrajes?.barral_recto || 0;
    const extra = valor * extras.barralRecto;

    costo += extra;

    items.push({
      tipo: "barral_recto",
      precio: Math.round(extra),
    });
  }

  if (extras.barralCurvo) {
    const valor = superficies.herrajes?.barral_curvo || 0;
    const extra = valor * extras.barralCurvo;

    costo += extra;

    items.push({
      tipo: "barral_curvo",
      precio: Math.round(extra),
    });
  }

  if (extras.manija) {
    const extra = superficies.herrajes?.manija_metalica || 0;

    costo += extra;

    items.push({
      tipo: "manija",
      precio: Math.round(extra),
    });
  }

  if (extras.picaporte) {
    const extra = superficies.herrajes?.picaporte?.[linea] || 0;

    costo += extra;

    items.push({
      tipo: "picaporte",
      precio: Math.round(extra),
    });
  }

  // ========================
  // 💰 PERFIL
  // ========================
  const perfilData = perfiles[perfil]?.[linea] || perfiles.amarilla[linea];

  let total = costo;

  total *= 1 - perfilData.descuento;
  total *= 1 + perfilData.flete;
  total *= 1 + perfilData.ganancia;

  return {
    total: Math.round(total),
    costo: Math.round(costo),
    ganancia: Math.round(total - costo),
    hojas: base.hojas || 1,
    descripcion: `${linea} ${dataInput.tipo || "simple"}`,
    items,
  };
}

module.exports = calcularPuertaWrapper;
