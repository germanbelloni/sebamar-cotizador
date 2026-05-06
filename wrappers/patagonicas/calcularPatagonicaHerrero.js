const { fromRoot } = require("../../backend/utils/path");

const service = require(
  fromRoot("services/patagonicas/calcularPatagonicaHerrero"),
);

const perfiles = require(fromRoot("config/perfiles"));
const colores = require(fromRoot("frontend/data/colores.json"));

// 🎨
function getColorFactor(color) {
  const c = colores.find(
    (x) => x.nombre.toLowerCase().trim() === (color || "").toLowerCase().trim(),
  );
  return c ? c.valor : 0;
}

// 🧠 SVG
function buildPatagonicaSVG({ cantidadRajas, ladoApertura, tipoApertura }) {
  if (cantidadRajas === 2) {
    return {
      tipo: "patagonica",
      layout: ["bisagra_izq", "pano_fijo", "bisagra_der"],
      apertura: tipoApertura,
    };
  }

  if (ladoApertura === "izquierda") {
    return {
      tipo: "patagonica",
      layout: ["bisagra_izq", "pano_fijo"],
      apertura: tipoApertura,
    };
  }

  return {
    tipo: "patagonica",
    layout: ["pano_fijo", "bisagra_der"],
    apertura: tipoApertura,
  };
}

function calcularWrapper(data) {
  const {
    medidaTotal,
    tipo,
    raja,
    color,
    perfil = "amarilla",
    ladoApertura = "derecha",
    tipoApertura = "abrir",
  } = data;

  const base = service(data);

  let costoBase = base.total;

  const items = [
    {
      tipo: "estructura",
      descripcion: tipo,
      precio: Math.round(costoBase),
      costo: Math.round(costoBase),
    },
  ];

  // 🎨 COLOR
  const colorFactor = getColorFactor(color);
  const costoColor = costoBase * colorFactor;

  if (costoColor > 0) {
    items.push({
      tipo: "color",
      descripcion: color,
      precio: Math.round(costoColor),
    });
  }

  let costoConExtras = costoBase + costoColor;

  // 💰 PERFIL
  const perfilData = perfiles[perfil]?.herrero || perfiles.amarilla.herrero;

  const costo = costoConExtras * (1 - perfilData.descuento);
  const proveedor = costo * (1 + perfilData.flete);
  const venta = proveedor * (1 + perfilData.ganancia);

  return {
    costoBase: Math.round(costoBase),
    costo: Math.round(costo),
    precioProveedor: Math.round(proveedor),
    precioVenta: Math.round(venta),
    ganancia: Math.round(venta - costo),
    items,
    descripcion: `Patagónica Herrero ${medidaTotal}`,
    configuracion: {
      medidaTotal,
      tipo,
      color,
      svg: buildPatagonicaSVG({
        cantidadRajas: tipo === "2_rajas" ? 2 : 1,
        ladoApertura,
        tipoApertura,
      }),
    },
  };
}

module.exports = calcularWrapper;
