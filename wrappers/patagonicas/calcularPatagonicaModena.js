const { fromRoot } = require("../../backend/utils/path");

const service = require(
  fromRoot("services/patagonicas/calcularPatagonicaModena"),
);

const perfiles = require(fromRoot("config/perfiles"));

const colores = require(fromRoot("frontend/data/colores.json"));

const { buildPatagonicaSVG } = require(fromRoot("utils/svg"));

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
// 🚀 WRAPPER
// =========================

function calcularWrapper(data) {
  let {
    medida,
    ancho,
    alto,
    cantidadRajas = 1,
    tipoVidrio,
    color = "blanco",
    perfil = "amarilla",
    ladoApertura = "derecha",
    tipoApertura = "abrir",
  } = data;

  // =========================
  // 📏 NORMALIZAR
  // =========================

  let anchoFinal = ancho;

  let altoFinal = alto;

  if (medida && typeof medida === "string") {
    const clean = medida.trim().toLowerCase();

    if (!clean.includes("x")) {
      throw new Error("Formato de medida inválido");
    }

    const partes = clean.split("x").map(Number);

    if (partes.length !== 2 || partes.some(isNaN)) {
      throw new Error("Medida inválida");
    }

    anchoFinal = partes[0];

    altoFinal = partes[1];
  }

  if (!anchoFinal || !altoFinal) {
    throw new Error("Faltan medidas");
  }

  const medidaFinal = `${anchoFinal}x${altoFinal}`;

  // =========================
  // 🔧 TIPO
  // =========================

  const tipo = cantidadRajas === 2 ? "2_rajas" : "1_raja";

  // =========================
  // 🧠 SERVICE
  // =========================

  const base = service({
    tipo,
    medida: medidaFinal,
    tipoVidrio,
  });

  // =========================
  // 🎨 COLOR
  // =========================

  const colorFactor = getColorFactor(color);

  const items = base.items.map((i) => {
    let precio = i.precio;

    // SOLO estructura lleva color
    if (i.tipo === "estructura") {
      precio *= 1 + colorFactor;
    }

    return {
      ...i,
      precio: Math.round(precio),
    };
  });

  // =========================
  // 💰 COSTO BASE
  // =========================

  const costoBase = items.reduce((acc, i) => acc + Number(i.precio || 0), 0);

  // =========================
  // 💰 PERFIL
  // =========================

  const perfilData = perfiles[perfil]?.modena || perfiles.amarilla.modena;

  const costo = costoBase * (1 - perfilData.descuento);

  const proveedor = costo * (1 + perfilData.flete);

  const venta = proveedor * (1 + perfilData.ganancia);

  // =========================
  // 🧠 CONFIG
  // =========================

  const configuracion = {
    ancho: anchoFinal,

    alto: altoFinal,

    medida: medidaFinal,

    cantidadRajas,

    tipo,

    color,

    tipoVidrio,

    svg: buildPatagonicaSVG({
      cantidadRajas,

      ladoApertura,

      tipoApertura,
    }),
  };

  return {
    costoBase: Math.round(costoBase),

    costo: Math.round(costo),

    precioProveedor: Math.round(proveedor),

    precioVenta: Math.round(venta),

    ganancia: Math.round(venta - costo),

    items,

    descripcion: `Patagónica Modena ${medidaFinal}`,

    configuracion,
  };
}

module.exports = calcularWrapper;
