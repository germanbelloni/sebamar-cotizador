const { fromRoot } = require("../../utils/path");
const colores = require(fromRoot("frontend/data/colores.json"));
const perfiles = require("../../config/perfiles");

// 📦 DATA (una sola vez)
const rajaData = require(
  fromRoot("frontend/data/productos/rajas_herrero.json"),
);

const PRECIO_ACOPLE = 5905;
const PRECIO_PANO = 10685;

function getColorValor(color) {
  const c = colores.find(
    (x) => x.nombre.toLowerCase().trim() === (color || "").toLowerCase().trim(),
  );
  return c ? c.valor : 0;
}

function parseMedida(medida) {
  const [ancho, alto] = medida.split("x").map(Number);
  return { ancho, alto };
}

function getRajaPrecio({ medida, tipoVidrio, color }) {
  const datos = rajaData.medidas?.[medida];

  if (!datos) throw new Error("Raja no encontrada");

  const base = datos.base || 0;
  const vidrio = datos.vidrios?.[tipoVidrio] || 0;

  const colorValor = getColorValor(color);
  const baseColor = base * (1 + colorValor);

  return baseColor + vidrio;
}

function calcularPatagonicaHerrero(dataInput) {
  const { medidaTotal, tipo, raja, color, perfil = "amarilla" } = dataInput;

  const perfilData = perfiles[perfil]?.herrero || perfiles["amarilla"].herrero;

  const { ancho: anchoTotal, alto } = parseMedida(medidaTotal);

  const cantidadRajas = tipo === "2_rajas" ? 2 : 1;
  const anchoRaja = raja.ancho;

  const totalRajasAncho = anchoRaja * cantidadRajas;
  const anchoPano = anchoTotal - totalRajasAncho;

  if (anchoPano <= 0) {
    throw new Error("Configuración inválida");
  }

  const medidaRaja = `${anchoRaja}x${alto}`;

  // 🔹 RAJAS
  let totalRajas = 0;

  for (let i = 0; i < cantidadRajas; i++) {
    totalRajas += getRajaPrecio({
      medida: medidaRaja,
      tipoVidrio: raja.tipoVidrio,
      color,
    });
  }

  const colorValor = getColorValor(color);

  // 🔹 ACOPLE
  let precioAcople = (alto / 100) * PRECIO_ACOPLE;
  precioAcople *= 1 + colorValor;

  // 🔹 ESTRUCTURA PAÑO
  let precioPanoEstructura = ((anchoPano * 2 + alto * 2) / 100) * PRECIO_PANO;

  precioPanoEstructura *= 1 + colorValor;

  // 🔹 VIDRIO PAÑO
  const areaM2 = (anchoPano * alto) / 10000;

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

  // 🔹 TOTAL
  let total = totalRajas + precioAcople + totalPano;

  total *= 1 - perfilData.descuento;
  total *= 1 + perfilData.flete;
  total *= 1 + perfilData.ganancia;

  return {
    total: Math.round(total),
  };
}

module.exports = calcularPatagonicaHerrero;
