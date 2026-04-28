const { fromRoot } = require("../../backend/utils/path");

const calcularVentana = require(
  fromRoot("backend/services/ventanas/calcularVentana"),
);

const perfiles = require(fromRoot("backend/config/perfiles"));
const superficies = require(
  fromRoot("frontend/data/productos/superficies.json"),
);
const ventanas = require(
  fromRoot("frontend/data/productos/ventanas_modena.json"),
);
const colores = require(fromRoot("frontend/data/colores.json"));

// 📐
const calcularM2 = (a, h) => (a * h) / 10000;
const calcularML = (a, h) => (a * 2 + h * 2) / 100;

// 🎨
function getColorValor(color) {
  const c = colores.find(
    (x) => x.nombre.toLowerCase().trim() === (color || "").toLowerCase().trim(),
  );
  return c ? c.valor : 0;
}

// 🔍
function buscarMedidaValida(ancho, alto) {
  const medidas = Object.keys(ventanas.medidas);

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

// 💰
function aplicarPerfil(costo, p) {
  return costo * (1 - p.descuento) * (1 + p.flete) * (1 + p.ganancia);
}

// 🧠 UNIDAD
function calcularUnidad(data, perfil) {
  const perfilModena = perfiles[perfil]?.modena || perfiles.amarilla.modena;

  const r = calcularVentana({
    medida: data.medida,
    color: data.color,
    incluirGuia: data.guia,
    incluirMosquitero: data.mosquitero,
    linea: "modena",
    tipoVidrio: data.tipoVidrio,
  });

  let costoBase = r.costoBase;

  // ALTURA
  if (data.alto > 200 && data.alto <= 205) costoBase *= 1.05;
  else if (data.alto > 205) costoBase *= 1.1;

  // 3 hojas
  if (data.tresHojas === "2guias") {
    costoBase *= superficies.recargos?.tres_hojas || 1.2;
  }

  if (data.tresHojas === "3guias") {
    costoBase *= superficies.recargos?.cuatro_hojas || 1.3;
  }

  return aplicarPerfil(costoBase, perfilModena);
}

// 🚀 MAIN
function calcularVentanaModena(dataInput) {
  const {
    ancho,
    alto,
    color,
    tipoVidrio,
    perfil = "amarilla",
    tresHojas,
    bipuntos = [],
    herrajeBlanco,
    premarco,
    contramarco,
  } = dataInput;

  if (!ancho || !alto) throw new Error("Faltan medidas");

  if (ancho < 30 || ancho > 480)
    throw new Error("Ancho fuera de rango (30-480)");

  if (alto < 40 || alto > 210) throw new Error("Alto fuera de rango (40-210)");

  if (!tipoVidrio) throw new Error("Falta tipoVidrio");

  const altoBase = alto > 200 ? 200 : alto;

  let unidades = [];

  if (ancho > 240) {
    const mitad = ancho / 2;
    const m = buscarMedidaValida(mitad, altoBase);

    unidades.push({ medida: m, ancho: mitad, alto });
    unidades.push({ medida: m, ancho: mitad, alto });
  } else {
    const m = buscarMedidaValida(ancho, altoBase);
    unidades.push({ medida: m, ancho, alto });
  }

  let total = 0;
  let items = [];

  unidades.forEach((u) => {
    const v = calcularUnidad({ ...dataInput, ...u }, perfil);
    total += v;
  });

  const perfilModena = perfiles[perfil]?.modena || perfiles.amarilla.modena;

  const m2 = calcularM2(ancho, alto);
  const ml = calcularML(ancho, alto);

  // 🔹 VIDRIOS ESPECIALES
  if (tipoVidrio === "4+4") {
    total += superficies.vidrios["4+4"] * m2;
  }

  if (tipoVidrio === "dvh_5_9_5") {
    const vidrio = superficies.vidrios["5+5"];
    const camara = superficies.vidrios["dvh"];

    total += (vidrio * 2 + camara) * m2;
  }

  // 🔹 BIPUNTOS (NUEVO SISTEMA)
  if (bipuntos.length) {
    bipuntos.forEach((b, i) => {
      let costo = superficies.extras.bipunto || 0;

      if (b.tipo === "llave") {
        costo = superficies.extras.bipuntoConLlave || 45000;
      }

      const venta = aplicarPerfil(costo, perfilModena);

      total += venta;

      items.push({
        tipo: "bipunto",
        descripcion: `Bipunto ${b.tipo || "comun"}`,
        precio: Math.round(venta),
      });
    });
  }

  // 🔹 HERRAJE BLANCO
  if (herrajeBlanco) total *= 1.05;

  // 🔹 PREMARCO / CONTRAMARCO
  const colorFactor = 1 + getColorValor(color);

  if (premarco) {
    const costo = superficies.superficies.premarco * ml;
    const venta = aplicarPerfil(costo, perfilModena);

    total += venta;
    items.push({ tipo: "premarco", precio: Math.round(venta) });

    const costoC = superficies.superficies.contramarco * ml * colorFactor;
    const ventaC = aplicarPerfil(costoC, perfilModena);

    total += ventaC;
    items.push({ tipo: "contramarco", precio: Math.round(ventaC) });
  } else if (contramarco) {
    const costo = superficies.superficies.contramarco * ml * colorFactor;
    const venta = aplicarPerfil(costo, perfilModena);

    total += venta;
    items.push({ tipo: "contramarco", precio: Math.round(venta) });
  }

  return {
    total: Math.round(total),
    items,
  };
}

module.exports = calcularVentanaModena;
