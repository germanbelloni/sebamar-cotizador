const fs = require("fs");
const path = require("path");
const colores = require("../../data/colores.json");

// 🔥 PRECIOS REALES
const PRECIO_ACOPLE = 5905;
const PRECIO_PANO = 10685;

// 🔹 COLOR
function getColorValor(color) {
  const c = colores.find(
    (x) => x.nombre.toLowerCase().trim() === (color || "").toLowerCase().trim(),
  );
  return c ? c.valor : 0;
}

// 🔹 PARSE "200x150"
function parseMedida(medida) {
  const [ancho, alto] = medida.split("x").map(Number);
  return { ancho, alto };
}

// 🔹 RAJA
function getRajaPrecio({ medida, tipoVidrio, color }) {
  const data = JSON.parse(
    fs.readFileSync(
      path.join(process.cwd(), "data/productos/rajas_herrero.json"),
      "utf-8",
    ),
  );

  const datos = data.medidas?.[medida];

  if (!datos) throw new Error("Raja no encontrada");

  const base = datos.base || 0;
  const vidrio = datos.vidrios?.[tipoVidrio] || 0;

  const colorValor = getColorValor(color);
  const baseColor = base * (1 + colorValor);

  return baseColor + vidrio;
}

function calcularPatagonicaHerrero(dataInput) {
  const { medidaTotal, tipo, raja, color } = dataInput;

  const { ancho: anchoTotal, alto } = parseMedida(medidaTotal);

  const cantidadRajas = tipo === "2_rajas" ? 2 : 1;
  const anchoRaja = raja.ancho;

  const totalRajasAncho = anchoRaja * cantidadRajas;

  // 🔥 VALIDACIÓN
  const anchoPano = anchoTotal - totalRajasAncho;

  if (anchoPano <= 0) {
    throw new Error("Configuración inválida");
  }

  // 🔹 MEDIDA RAJA
  const medidaRaja = `${anchoRaja}x${alto}`;

  // 🔹 TOTAL RAJAS
  let totalRajas = 0;

  for (let i = 0; i < cantidadRajas; i++) {
    totalRajas += getRajaPrecio({
      medida: medidaRaja,
      tipoVidrio: raja.tipoVidrio,
      color,
    });
  }

  // 🔹 COLOR GLOBAL
  const colorValor = getColorValor(color);

  // 🔹 ACOPLE (CON COLOR ✔)
  const altoMetros = alto / 100;
  let precioAcople = altoMetros * PRECIO_ACOPLE;
  precioAcople *= 1 + colorValor;

  // 🔹 PAÑO FIJO - ESTRUCTURA (CON COLOR ✔)
  const perimetro = (anchoPano * 2 + alto * 2) / 100;
  let precioPanoEstructura = perimetro * PRECIO_PANO;
  precioPanoEstructura *= 1 + colorValor;

  // 🔹 VIDRIO PAÑO
  const areaM2 = (anchoPano * alto) / 10000;

  const rajaData = JSON.parse(
    fs.readFileSync(
      path.join(process.cwd(), "data/productos/rajas_herrero.json"),
      "utf-8",
    ),
  );

  const muestra = rajaData.medidas[medidaRaja];

  if (!muestra) throw new Error("Vidrio referencia no encontrado");

  let precioVidrioM2 = 0;

  if (raja.tipoVidrio === "dvh") {
    const vidrio4 = muestra.vidrios["4mm"] || 0;
    precioVidrioM2 = vidrio4 * 2;
  } else {
    precioVidrioM2 = muestra.vidrios?.[raja.tipoVidrio] || 0;
  }

  const precioVidrio = areaM2 * precioVidrioM2;

  const totalPano = precioPanoEstructura + precioVidrio;

  // 🔥 TOTAL GENERAL
  let total = totalRajas + precioAcople + totalPano;

  // 🔹 REGLAS (por ahora fijas)
  const descuento = 0.1;
  const flete = 0.06;
  const ganancia = 0.3;

  total *= 1 - descuento;
  total *= 1 + flete;
  total *= 1 + ganancia;

  return {
    total: Math.round(total),
  };
}

module.exports = calcularPatagonicaHerrero;
