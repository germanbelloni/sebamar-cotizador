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

// 💰 PERFIL
function aplicarPerfil(costo, p) {
  const proveedor = costo * (1 - p.descuento);
  const venta = proveedor * (1 + p.flete) * (1 + p.ganancia);

  return { proveedor, venta };
}

// 🚀 WRAPPER
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
    tipo = "simple",
    modelo,
    apertura, // 🔥 NUEVO
  } = dataInput;

  // ========================
  // 🚪 BASE
  // ========================
  const base = calcularPuertas(dataInput);

  let costo = base.costo || 0;

  const items = [];

  items.push({
    tipo: "base",
    descripcion: modelo,
    precio: Math.round(costo),
  });

  // ========================
  // ➕ EXTRAS
  // ========================

  if (extras.barralRecto) {
    const extra =
      (superficies.herrajes?.barral_recto || 0) * extras.barralRecto;

    costo += extra;

    items.push({
      tipo: "barral_recto",
      precio: Math.round(extra),
    });
  }

  if (extras.barralCurvo) {
    const extra =
      (superficies.herrajes?.barral_curvo || 0) * extras.barralCurvo;

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

  const { proveedor, venta } = aplicarPerfil(costo, perfilData);

  return {
    costoBase: Math.round(base.costo),
    costo: Math.round(costo),
    precioProveedor: Math.round(proveedor),
    precioVenta: Math.round(venta),
    ganancia: Math.round(venta - costo),

    items,

    descripcion: `Puerta ${linea} ${modelo}`,

    configuracion: {
      tipo,
      hojas: base.hojas || 1,
      linea,
      color,
      modelo,

      // 🔥 SVG READY
      svg: {
        tipo: "puerta",
        apertura: apertura || "derecha",

        hojas: base.hojas || 1,

        manija: extras.manija
          ? {
              tipo: "manija",
              svgKey: "manija_standard",
            }
          : null,

        barral: extras.barralRecto
          ? { tipo: "recto", svgKey: "barral_recto" }
          : extras.barralCurvo
            ? { tipo: "curvo", svgKey: "barral_curvo" }
            : null,
      },
    },
  };
}

module.exports = calcularPuertaWrapper;
