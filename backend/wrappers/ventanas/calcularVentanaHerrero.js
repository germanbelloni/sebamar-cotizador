const { fromRoot } = require("../../utils/path");

const calcularVentana = require(fromRoot("services/ventanas/calcularVentana"));
const superficies = require(
  fromRoot("frontend/data/productos/superficies.json"),
);
const perfiles = require(fromRoot("config/perfiles"));
const ventanas = require(
  fromRoot("frontend/data/productos/ventanas_herrero.json"),
);

// 📐 m²
function calcularM2(ancho, alto) {
  return (ancho * alto) / 10000;
}

// 🔍 lookup por eje
function buscarMedidaValida(ancho, alto) {
  const medidas = Object.keys(ventanas.medidas);

  const anchos = [...new Set(medidas.map((m) => Number(m.split("x")[0])))];
  const altos = [...new Set(medidas.map((m) => Number(m.split("x")[1])))];

  const anchoValido = anchos.sort((a, b) => a - b).find((a) => a >= ancho);
  const altoValido = altos.sort((a, b) => a - b).find((h) => h >= alto);

  if (!anchoValido || !altoValido) {
    throw new Error("No hay medida válida");
  }

  return `${anchoValido}x${altoValido}`;
}

function calcularVentanaHerrero(dataInput) {
  const {
    ancho,
    alto,
    vidrio,
    color,
    guia,
    mosquitero,
    cajon,
    cortina,
    perfil = "amarilla",
  } = dataInput;

  if (!ancho || !alto) {
    throw new Error("Faltan medidas");
  }

  const medida = buscarMedidaValida(ancho, alto);

  // =========================
  // 🔹 BASE
  // =========================

  const baseResult = calcularVentana({
    medida,
    tipoVidrio: "3mm",
    color,
    perfil,
    linea: "herrero",
  });

  let total = baseResult.total;

  const perfilData = perfiles[perfil]?.herrero || perfiles["amarilla"].herrero;

  const m2 = calcularM2(ancho, alto);

  // =========================
  // 🪟 VIDRIO (reemplazo)
  // =========================

  if (vidrio && vidrio !== "3mm") {
    const vidrioBase = ventanas.medidas[medida].vidrio || 0;

    // sacamos vidrio base
    total -= vidrioBase;

    if (vidrio === "4mm") {
      total += ventanas.medidas[medida].vidrio4mm || 0; // si lo tenés
    } else {
      const precio = superficies.vidrios[vidrio] || 0;
      total += precio * m2;
    }
  }
  // =========================
  // ➕ GUÍA
  // =========================

  if (guia) {
    total += ventanas.medidas[medida].guia || 0;
  }

  // =========================
  // 📊 SUBTOTAL → PERFIL
  // =========================

  total *= 1 - perfilData.descuento;
  total *= 1 + perfilData.flete;
  total *= 1 + perfilData.ganancia;

  // =========================
  // 📦 CAJÓN (FUERA DE DESCUENTO)
  // =========================

  if (cajon) {
    const precioCajon = superficies.cajon_block || 0;
    total += precioCajon * m2;
  }

  // =========================
  // 📦 ITEMS SEPARADOS
  // =========================

  const items = [];

  // 🧵 MOSQUITERO (JSON)
  if (mosquitero) {
    const precioMosq = ventanas.medidas[medida].mosquitero || 0;

    items.push({
      tipo: "mosquitero",
      descripcion: `Mosquitero fijo ${medida}`,
      precio: precioMosq,
    });
  }

  // 🪟 CORTINAS
  if (cortina && guia) {
    let anchoC = ancho;
    let altoC = alto + 17;

   if (cortina === "pvc") {
  anchoC = ancho - 1;
  const precio = superficies.cortinas?.pvc;

  if (!precio) {
    console.log("⚠️ Falta precio cortina PVC");
  } else {
    items.push({
      tipo: "cortina",
      descripcion: `Cortina PVC ${anchoC}x${altoC}`,
      precio: Math.round(precio * ((anchoC * altoC) / 10000)),
    });
  }
}
    if (cortina === "aluminio") {
      anchoC = ancho + 3;

      const precio = superficies.cortinas?.aluminio?.blanco || 0;

      items.push({
        tipo: "cortina",
        descripcion: `Cortina aluminio ${anchoC}x${altoC}`,
        precio: precio * ((anchoC * altoC) / 10000),
      });
    }
  }

  // =========================
  // 🧾 DESCRIPCIÓN
  // =========================

  let descripcion = `Ventana Herrero ${ancho}x${alto} aluminio ${color}`;

  if (vidrio) descripcion += ` vidrio ${vidrio}`;
  if (guia) descripcion += ` con guía`;
  if (cajon) descripcion += ` con cajón`;

  return {
    total: Math.round(total),
    medidaUsada: medida,
    descripcion,
    items,
  };
}

module.exports = calcularVentanaHerrero;
