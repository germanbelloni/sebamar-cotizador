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

// 📐
const calcularM2 = (a, h) => (a * h) / 10000;

// 🧠 NORMALIZADOR ALTURA (CLAVE)
function normalizarAltura(alto) {
  if (alto > 200 && alto <= 205) return 200;
  if (alto > 205) return 200;
  return alto;
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

// 🧠
function calcularUnidad(data, perfil) {
  const perfilModena = perfiles[perfil]?.modena || perfiles.amarilla.modena;
  const perfilMosq =
    perfiles[perfil]?.mosquiteros || perfiles.amarilla.mosquiteros;

  const r = calcularVentana({
    medida: data.medida,
    color: data.color,
    incluirGuia: data.guia,
    incluirMosquitero: data.mosquitero,
    linea: "modena",
    tipoVidrio: data.tipoVidrio,
  });

  let costoBase = r.costoBase;

  // 🔹 ALTURA (después del lookup)
  if (data.alto > 200 && data.alto <= 205) costoBase *= 1.05;
  else if (data.alto > 205) costoBase *= 1.1;

  // 🔹 3 HOJAS
  if (data.tresHojas === "2guias") costoBase *= 1.2;
  if (data.tresHojas === "3guias") costoBase *= 1.3;

  const ventaBase = aplicarPerfil(costoBase, perfilModena);
  const ventaGuia = data.guia ? aplicarPerfil(r.costoGuia, perfilModena) : 0;
  const ventaMosq = data.mosquitero
    ? aplicarPerfil(r.costoMosquitero, perfilMosq)
    : 0;

  const items = [];

  if (data.guia) {
    items.push({
      tipo: "guia",
      precio: Math.round(ventaGuia),
    });
  }

  if (data.mosquitero) {
    items.push({
      tipo: "mosquitero",
      precio: Math.round(ventaMosq),
    });
  }

  return {
    venta: ventaBase + ventaGuia + ventaMosq,
    costo: costoBase,
    items,
  };
}

// 🚀 MAIN
function calcularVentanaModena(dataInput, options = {}) {
  const { ancho, alto, perfil = "amarilla", tipoVidrio } = dataInput;

  if (!ancho || !alto) throw new Error("Faltan medidas");
  if (!tipoVidrio) throw new Error("Falta tipoVidrio");

  let unidades = [];

  // 🔹 NORMALIZAR ALTURA PARA LOOKUP
  const altoBase = normalizarAltura(alto);

  if (ancho > 240) {
    const mitad = ancho / 2;

    const m = buscarMedidaValida(mitad, altoBase);

    unidades.push({ medida: m, ancho: mitad, alto });
    unidades.push({ medida: m, ancho: mitad, alto });
  } else {
    const m = buscarMedidaValida(ancho, altoBase);
    unidades.push({ medida: m, ancho, alto });
  }

  let totalVenta = 0;
  let items = [];

  unidades.forEach((u) => {
    const r = calcularUnidad({ ...dataInput, ...u }, perfil);
    totalVenta += r.venta;
    items = items.concat(r.items);
  });

  const perfilModena = perfiles[perfil]?.modena || perfiles.amarilla.modena;

  // 🔹 BIPUNTO (BIEN APLICADO)
  if (dataInput.bipunto) {
    const costo = superficies.bipunto * (dataInput.bipuntoCantidad || 1);
    const venta = aplicarPerfil(costo, perfilModena);

    totalVenta += venta;

    items.push({
      tipo: "bipunto",
      precio: Math.round(venta),
    });
  }

  // 🔹 CORTINA (CONSISTENTE CON PERFIL)
  if (dataInput.cortina && dataInput.guia) {
    const m2 = calcularM2(ancho, alto);
    const costo = (superficies.cortinas?.pvc || 0) * m2;

    const venta = aplicarPerfil(costo, perfilModena);

    totalVenta += venta;

    items.push({
      tipo: "cortina",
      precio: Math.round(venta),
    });
  }

  return {
    total: Math.round(totalVenta),
    items,
  };
}

module.exports = calcularVentanaModena;
