const { fromRoot } = require("../../backend/utils/path");

const perfiles = require(fromRoot("config/perfiles"));

const superficies = require(
  fromRoot("backend/data/productos/superficies.json"),
);

const colores = require(fromRoot("backend/data/colores.json"));

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
// 🚀 MAIN
// =========================

function calcularPuertaMosquitera(dataInput) {
  const {
    ancho,
    alto,
    color = "blanco",
    perfil = "amarilla",
    ladoBisagra = "derecha",
  } = dataInput;

  // =========================
  // VALIDACIONES
  // =========================

  if (ancho < 70 || ancho > 100) {
    throw new Error("Ancho fuera de rango");
  }

  if (alto < 180 || alto > 210) {
    throw new Error("Alto fuera de rango");
  }

  if (!["izquierda", "derecha"].includes(ladoBisagra)) {
    throw new Error("Lado de bisagra inválido");
  }
  // =========================
  // 💰 BASE SEGÚN ANCHO
  // =========================

  const anchoBase = ancho <= 85 ? "80" : "90";

  const base = superficies.puertas_mosquitero?.[anchoBase];

  if (!base) {
    throw new Error("Falta precio puerta mosquitera");
  }

  let costoBase = Number(base);

  const items = [
    {
      tipo: "estructura",
      descripcion: `${ancho}x${alto}`,
      precio: Math.round(costoBase),
    },
  ];

  // =========================
  // 🎨 COLOR
  // SOLO ESTRUCTURA
  // =========================

  const colorFactor = getColorFactor(color);

  const costoColor = costoBase * colorFactor;

  if (costoColor > 0) {
    costoBase += costoColor;

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

  let costo = costoBase;

  costo *= 1 + perfilData.aumento1;
  costo *= 1 + perfilData.aumento2;

  const venta = costo * (1 + perfilData.ganancia);

  // =========================
  // ✅ RESPONSE
  // =========================

  return {
    costoBase: Math.round(costoBase),

    costo: Math.round(costo),

    precioProveedor: Math.round(costo),

    precioVenta: Math.round(venta),

    ganancia: Math.round(venta - costo),

    items: items.map((i) => ({
      tipo: i.tipo,
      descripcion: i.descripcion,
      precio: Math.round(i.precio || 0),
    })),

    descripcion: `Puerta mosquitera ${ancho}x${alto} bisagra ${ladoBisagra}`,
    configuracion: {
      ancho,
      alto,
      color,
      ladoBisagra,
    },
  };
}

module.exports = calcularPuertaMosquitera;
