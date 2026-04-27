const { fromRoot } = require("../../utils/path");

const calcularVentana = require(
  fromRoot("backend/services/ventanas/calcularVentana"),
);
const perfiles = require(fromRoot("backend/config/perfiles"));
const superficies = require(
  fromRoot("frontend/data/productos/superficies.json"),
);
const ventanas = require(
  fromRoot("frontend/data/productos/ventanas_herrero.json"),
);

// 📐 m²
function calcularM2(ancho, alto) {
  return (ancho * alto) / 10000;
}

// 🔍 LOOKUP
function buscarMedidaValida(ancho, alto) {
  const medidas = Object.keys(ventanas.medidas);

  const anchos = [...new Set(medidas.map((m) => Number(m.split("x")[0])))].sort(
    (a, b) => a - b,
  );

  const altos = [...new Set(medidas.map((m) => Number(m.split("x")[1])))].sort(
    (a, b) => a - b,
  );

  const anchoValido = anchos.find((a) => a >= ancho);
  const altoValido = altos.find((h) => h >= alto);

  if (!anchoValido || !altoValido) {
    throw new Error("No hay medida válida");
  }

  return `${anchoValido}x${altoValido}`;
}

// 💰 PERFIL
function aplicarPerfil(costo, perfilData) {
  let v = costo;
  v *= 1 - perfilData.descuento;
  v *= 1 + perfilData.flete;
  v *= 1 + perfilData.ganancia;
  return v;
}

// =========================
// 🧠 CALCULO UNITARIO
// =========================
function calcularUnidad(data, perfil) {
  const perfilHerrero =
    perfiles[perfil]?.herrero || perfiles["amarilla"].herrero;

  const perfilMosq =
    perfiles[perfil]?.mosquiteros || perfiles["amarilla"].mosquiteros;

  const result = calcularVentana({
    medida: data.medida,
    color: data.color,
    incluirGuia: data.guia,
    incluirMosquitero: data.mosquitero,
    linea: "herrero",
  });

  let costoBase = result.costoBase;
  let costoGuia = result.costoGuia;
  let costoMosq = result.costoMosquitero;

  // 🔹 3 HOJAS (esto sí es técnico-comercial por unidad)
  if (data.tresHojas === "2guias") {
    costoBase *= 1.2;
  } else if (data.tresHojas === "3guias") {
    costoBase *= 1.3;
  }

  const ventaBase = aplicarPerfil(costoBase, perfilHerrero);
  const ventaGuia = data.guia ? aplicarPerfil(costoGuia, perfilHerrero) : 0;
  const ventaMosq = data.mosquitero ? aplicarPerfil(costoMosq, perfilMosq) : 0;

  const items = [];

  if (data.guia) {
    items.push({
      tipo: "guia",
      descripcion: `Guía ${data.medida}`,
      precio: Math.round(ventaGuia),
      costo: costoGuia,
    });
  }

  if (data.mosquitero) {
    items.push({
      tipo: "mosquitero",
      descripcion: `Mosquitero ${data.medida}`,
      precio: Math.round(ventaMosq),
      costo: costoMosq,
    });
  }

  return {
    venta: ventaBase,
    costo: costoBase,
    items,
  };
}

// =========================
// 🚀 WRAPPER
// =========================
function calcularVentanaHerrero(dataInput, options = {}) {
  const debug = options.debug;

  const {
    ancho,
    alto,
    color,
    guia,
    mosquitero,
    cortina,
    perfil = "amarilla",
    tresHojas,
  } = dataInput;

  if (!ancho || !alto) throw new Error("Faltan medidas");

  // 👉 GUARDAMOS ALTURA ORIGINAL
  const altoOriginal = alto;

  // 👉 NORMALIZAMOS PARA LOOKUP
  let altoLookup = alto;
  if (alto > 200) altoLookup = 200;

  let unidades = [];

  // =========================
  // 🔹 DIVISIÓN
  // =========================
  if (ancho > 240) {
    const mitad = ancho / 2;

    const medida = buscarMedidaValida(mitad, altoLookup);

    unidades.push({ medida, ancho: mitad, alto });
    unidades.push({ medida, ancho: mitad, alto });
  } else {
    const medida = buscarMedidaValida(ancho, altoLookup);
    unidades.push({ medida, ancho, alto });
  }

  let totalVenta = 0;
  let totalCosto = 0;
  let items = [];

  unidades.forEach((u) => {
    const res = calcularUnidad(
      {
        ...u,
        color,
        guia,
        mosquitero,
        tresHojas,
      },
      perfil,
    );

    totalVenta += res.venta;
    totalCosto += res.costo;
    items = items.concat(res.items);
  });

  // =========================
  // 🪟 CORTINAS
  // =========================
  if (cortina && guia) {
    const m2 = calcularM2(ancho, alto);

    if (cortina === "pvc") {
      const precio = superficies.cortinas?.pvc || 0;
      items.push({
        tipo: "cortina",
        descripcion: `Cortina PVC ${ancho}x${alto}`,
        precio: Math.round(precio * m2),
      });
      totalVenta += precio * m2;
    }

    if (cortina === "aluminio") {
      const precio = superficies.cortinas?.aluminio?.blanco || 0;
      items.push({
        tipo: "cortina",
        descripcion: `Cortina aluminio ${ancho}x${alto}`,
        precio: Math.round(precio * m2),
      });
      totalVenta += precio * m2;
    }
  }

  // =========================
  // 📏 RECARGO POR ALTURA (FINAL)
  // =========================
  if (altoOriginal > 200 && altoOriginal <= 205) {
    totalVenta *= 1.05;
  } else if (altoOriginal > 205 && altoOriginal <= 210) {
    totalVenta *= 1.1;
  }

  // =========================
  // 🧾 DESCRIPCIÓN
  // =========================
  let descripcion = `Ventana Herrero ${ancho}x${alto} aluminio ${color}`;
  if (guia) descripcion += " con guía";
  if (mosquitero) descripcion += " con mosquitero";

  const response = {
    total: Math.round(totalVenta),
    descripcion,
    items,
  };

  if (debug) {
    response.admin = {
      venta: Math.round(totalVenta),
      costo: Math.round(totalCosto),
      ganancia: Math.round(totalVenta - totalCosto),
    };
  }

  return response;
}

module.exports = calcularVentanaHerrero;
