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

function calcularPuertaWrapper(dataInput) {
  if (!dataInput.medida && dataInput.ancho && dataInput.alto) {
    dataInput.medida = `${dataInput.ancho}x${dataInput.alto}`;
  }

  const { perfil = "amarilla", raja, ventana, extras = {}, color } = dataInput;

  let { costo } = calcularPuertas(dataInput);

  // ========================
  // 🪟 RAJA
  // ========================
  if (raja && raja.ancho && raja.alto) {
    const r = calcularRaja({
      medida: `${raja.ancho}x${raja.alto}`,
      color,
      tipoVidrio: raja.tipoVidrio || "3+3",
      modelo: "4",
      linea: dataInput.linea,
    });

    costo += r.total || r.costoBase || 0;
  }

  // ========================
  // 🪟 VENTANA
  // ========================
  if (ventana) {
    const v = calcularVentana({
      linea: dataInput.linea,
      medida: "60x40",
      color,
      tipoVidrio: "3mm",
    });

    costo += v.costoBase || 0;
  }

  // ========================
  // ➕ EXTRAS
  // ========================
  if (extras.barralRecto) {
    const valor = superficies.herrajes?.barral_recto || 0;
    costo += valor * extras.barralRecto;
  }

  if (extras.barralCurvo) {
    const valor = superficies.herrajes?.barral_curvo || 0;
    costo += valor * extras.barralCurvo;
  }

  if (extras.manija) {
    costo += superficies.herrajes?.manija_metalica || 0;
  }

  if (extras.picaporte) {
    costo += superficies.herrajes?.picaporte?.[dataInput.linea] || 0;
  }

  // ========================
  // 💰 PERFIL
  // ========================
  const perfilData =
    perfiles[perfil]?.[dataInput.linea] ||
    perfiles["amarilla"][dataInput.linea];

  let total = costo;

  total *= 1 - perfilData.descuento;
  total *= 1 + perfilData.flete;
  total *= 1 + perfilData.ganancia;

  return {
    total: Math.round(total),
    costo: Math.round(costo),
    ganancia: Math.round(total - costo),
  };
}

module.exports = calcularPuertaWrapper;
    