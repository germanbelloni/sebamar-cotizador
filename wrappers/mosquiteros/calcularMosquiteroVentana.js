const { fromRoot } = require("../../backend/utils/path");

const calcularMosquitero = require(
  fromRoot("services/mosquiteros/calcularMosquitero"),
);

const perfiles = require(fromRoot("config/perfiles"));

const colores = require(fromRoot("frontend/data/colores.json"));

const mosquiterosData = require(
  fromRoot("frontend/data/productos/mosquiteros.json"),
);

// =========================
// 🎨 COLOR
// =========================

function getColorFactor(color) {
  const c = colores.find(
    (x) => x.nombre.toLowerCase().trim() === (color || "").toLowerCase().trim(),
  );

  return c ? c.valor : 0;
}

// =========================
// 🔍 LOOKUP
// =========================

function buscarMedidaValida(anchoInput, altoInput) {
  const medidas = Object.keys(mosquiterosData.medidas).map((k) => {
    const [a, b] = k.split("x").map(Number);

    return {
      key: k,
      ancho: a,
      alto: b,
    };
  });

  const candidatas = medidas
    .filter((m) => m.ancho >= anchoInput && m.alto >= altoInput)
    .sort((a, b) => a.ancho * a.alto - b.ancho * b.alto);

  if (!candidatas.length) {
    throw new Error("No hay medida válida");
  }

  return candidatas[0];
}

// =========================
// 🚀 WRAPPER
// =========================

function calcularMosquiteroVentana(dataInput) {
  const { ancho, alto, color = "blanco", perfil = "amarilla" } = dataInput;

  const medidaValida = buscarMedidaValida(ancho, alto);

  // =========================
  // 🧠 SERVICE
  // =========================

  const base = calcularMosquitero({
    medida: medidaValida.key,
  });

  let costo = Number(base.costoBase || 0);

  const items = [...base.items];

  // =========================
  // 🎨 COLOR
  // =========================

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

  // =========================
  // 💰 PERFIL
  // =========================

  const perfilData = perfiles[perfil]?.moscas || perfiles.amarilla.moscas;

  let costoFinal = costo;

  costoFinal *= 1 + perfilData.aumento1;
  costoFinal *= 1 + perfilData.aumento2;

  const venta = costoFinal * (1 + perfilData.ganancia);

  // =========================
  // ✅ RESPONSE
  // =========================

  return {
    costoBase: Math.round(costo),

    costo: Math.round(costoFinal),

    precioProveedor: Math.round(costoFinal),

    precioVenta: Math.round(venta),

    ganancia: Math.round(venta - costoFinal),

    items: items.map((i) => ({
      tipo: i.tipo,
      descripcion: i.descripcion,
      precio: Math.round(i.precio || 0),
    })),

    descripcion: `Mosquitero ventana ${ancho}x${alto}`,

    configuracion: {
      ancho,
      alto,
      medidaUsada: medidaValida.key,
      color,
    },
  };
}

module.exports = calcularMosquiteroVentana;
