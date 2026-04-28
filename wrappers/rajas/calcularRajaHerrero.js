const { fromRoot } = require("../../backend/utils/path");

const calcularRaja = require(fromRoot("backend/services/rajas/calcularRaja"));

const superficies = require(
  fromRoot("frontend/data/productos/superficies.json"),
);

const perfiles = require(fromRoot("backend/config/perfiles"));

const data = require(fromRoot("frontend/data/productos/rajas_herrero.json"));

// 📐
const calcularM2 = (a, h) => (a * h) / 10000;

function normalizarAlto(alto) {
  if (alto > 150) return 150;
  return alto;
}

// 🔍
function buscarMedidaValida(ancho, alto) {
  const medidas = Object.keys(data.medidas);

  const anchos = [...new Set(medidas.map((m) => +m.split("x")[0]))].sort(
    (a, b) => a - b,
  );
  const altos = [...new Set(medidas.map((m) => +m.split("x")[1]))].sort(
    (a, b) => a - b,
  );

  const a = anchos.find((x) => x >= ancho);
  const h = altos.find((x) => x >= alto);

  if (!a || !h) throw new Error("No hay medida válida");

  return `${a}x${h}`;
}

// 💰 PERFIL
function aplicarPerfil(costo, p) {
  return costo * (1 - p.descuento) * (1 + p.flete) * (1 + p.ganancia);
}

// 🚀
function calcularRajaHerrero(dataInput) {
  const {
    ancho,
    alto,
    color,
    vidrio,
    mosquitero,
    modelo = "raja",
    desague,
    bisagra,
    cp8 = 1,
    perfil = "amarilla",
  } = dataInput;

  if (!ancho || !alto) throw new Error("Faltan medidas");

  if (ancho < 30 || ancho > 90) {
    throw new Error("Ancho fuera de rango (30 - 90)");
  }

  if (alto < 40 || alto > 180) {
    throw new Error("Alto fuera de rango (40 - 180)");
  }

  const altoLookup = normalizarAlto(alto);
  const medida = buscarMedidaValida(ancho, altoLookup);

  const base = calcularRaja({
    medida,
    tipoVidrio: vidrio,
    color,
    linea: "herrero",
  });

  let totalCosto = base.total;

  const m2 = calcularM2(ancho, alto);

  const items = [];

  // 🧵 MOSQUITERO
  if (mosquitero) {
    const costoMosq = (superficies.superficies.mosquitero_fijo || 0) * m2;

    totalCosto += costoMosq;

    items.push({
      tipo: "mosquitero",
      precio: Math.round(costoMosq),
    });
  }

  // 🔩 CP8
  if (cp8) {
    const costoCp8 = (superficies.extras.cp8 || 0) * cp8;

    totalCosto += costoCp8;

    items.push({
      tipo: "cp8",
      precio: Math.round(costoCp8),
    });
  }

  // 🔧 MODELO
  if (modelo === "brazo" || modelo === "volcable") {
    totalCosto += 4000;

    items.push({
      tipo: "modelo",
      descripcion: modelo,
      precio: 4000,
    });
  }

  // 📏 ALTURA (ANTES DEL PERFIL)
  if (alto > 150) {
    totalCosto *= 1.3;
  }

  // 💰 PERFIL
  const perfilData = perfiles[perfil]?.herrero || perfiles.amarilla.herrero;

  const totalVenta = aplicarPerfil(totalCosto, perfilData);

  // 🧾 DESCRIPCIÓN
  let descripcion = `Raja Herrero ${ancho}x${alto}`;

  if (vidrio) descripcion += ` vidrio ${vidrio}`;
  if (mosquitero) descripcion += ` con mosquitero`;
  if (modelo !== "raja") descripcion += ` ${modelo}`;
  if (desague) descripcion += ` con desagüe`;
  if (bisagra) descripcion += ` bisagra ${bisagra}`;

  return {
    total: Math.round(totalVenta),
    medidaUsada: medida,
    descripcion,
    items,
  };
}

module.exports = calcularRajaHerrero;
