const { fromRoot } = require("../../backend/utils/path");

const calcularPuertas = require(
  fromRoot("backend/services/puertas/calcularPuertas"),
);

const superficies = require(
  fromRoot("backend/data/productos/superficies.json"),
);

const perfiles = require(fromRoot("backend/config/perfiles"));

const colores = require(fromRoot("backend/data/colores.json"));

// ========================
// 🎨 COLOR
// ========================

function getColorFactor(color) {
  const c = colores.find(
    (x) => x.nombre.toLowerCase().trim() === (color || "").toLowerCase().trim(),
  );

  return c ? c.valor : 0;
}

// ========================
// 💰 PERFIL
// ========================

function aplicarPerfil(costo, p) {
  const proveedor = costo * (1 - p.descuento);

  const venta = proveedor * (1 + p.flete) * (1 + p.ganancia);

  return {
    proveedor,
    venta,
  };
}

// ========================
// 🚀 WRAPPER
// ========================

function calcularPuertaWrapper(dataInput) {
  if (!dataInput.medida && dataInput.ancho && dataInput.alto) {
    dataInput.medida = `${dataInput.ancho}x${dataInput.alto}`;
  }

  const {
    perfil = "amarilla",
    extras = {},
    color = "blanco",
    linea,
    tipo = "simple",
    modelo,
    apertura,
    hojas = 1,
  } = dataInput;

  // ========================
  // 🚪 BASE
  // ========================

  const base = calcularPuertas(dataInput);

  let costo = Number(base.costoBase || 0);

  const items = [...base.items];

  // ========================
  // 🎨 COLOR
  // SOLO ESTRUCTURA
  // ========================

  const estructura = items
    .filter((i) => i.tipo === "estructura")
    .reduce((acc, i) => acc + Number(i.precio || 0), 0);

  const colorFactor = getColorFactor(color);

  const costoColor = estructura * colorFactor;

  if (costoColor > 0) {
    costo += costoColor;

    items.push({
      tipo: "color",
      descripcion: color,
      precio: Math.round(costoColor),
    });
  }

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
  // 🚪 HERRAJE CORREDIZO
  // SOLO PORTONES 3+ HOJAS
  // ========================

  if (tipo === "corredizo" && Number(hojas) >= 3) {
    const extra = superficies.herrajes?.corredizo || 0;

    costo += extra;

    items.push({
      tipo: "herraje_corredizo",
      precio: Math.round(extra),
    });
  }

  // ========================
  // 🚪 HERRAJE PLEGADIZO
  // SOLO PORTONES 3+ HOJAS
  // ========================

  if (tipo === "plegadizo" && Number(hojas) >= 3) {
    const extra = superficies.herrajes?.plegadizo || 0;

    costo += extra;

    items.push({
      tipo: "herraje_plegadizo",
      precio: Math.round(extra),
    });
  }

  // ========================
  // 💰 PERFIL
  // ========================

  const perfilData = perfiles[perfil]?.[linea] || perfiles.amarilla[linea];

  const { proveedor, venta } = aplicarPerfil(costo, perfilData);

  return {
    costoBase: Math.round(base.costoBase),

    costo: Math.round(costo),

    precioProveedor: Math.round(proveedor),

    precioVenta: Math.round(venta),

    ganancia: Math.round(venta - costo),

    items: items.map((i) => ({
      tipo: i.tipo,

      descripcion: i.descripcion,

      precio: Math.round(i.precio || 0),
    })),

    descripcion: `Puerta ${linea} ${modelo}`,

    configuracion: {
      tipo,

      hojas: base.configuracion?.hojas || hojas || 1,

      linea,

      color,

      modelo,

      svg: {
        tipo: "puerta",

        apertura: apertura || "derecha",

        hojas: base.configuracion?.hojas || hojas || 1,

        manija: extras.manija
          ? {
              tipo: "manija",
              svgKey: "manija_standard",
            }
          : null,

        barral: extras.barralRecto
          ? {
              tipo: "recto",
              svgKey: "barral_recto",
            }
          : extras.barralCurvo
            ? {
                tipo: "curvo",
                svgKey: "barral_curvo",
              }
            : null,
      },
    },
  };
}

module.exports = calcularPuertaWrapper;
