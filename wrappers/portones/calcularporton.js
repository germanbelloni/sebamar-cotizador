const { fromRoot } = require("../../backend/utils/path");

const calcularPortones = require(
  fromRoot("backend/services/portones/calcularPortones"),
);

const perfiles = require(fromRoot("config/perfiles"));

const superficies = require(
  fromRoot("backend/data/productos/superficies.json"),
);

const colores = require(fromRoot("backend/data/colores.json"));

function getColorFactor(color) {
  const c = colores.find(
    (x) => x.nombre.toLowerCase().trim() === (color || "").toLowerCase().trim(),
  );

  return c ? c.valor : 0;
}

function calcularPortonWrapper(dataInput) {
  const {
    perfil = "amarilla",
    linea,
    color = "blanco",
    sistema,
    hojas = 3,
    modelo,
    extras = {},
    alto,
  } = dataInput;

  if (!["abrir", "corredizo", "plegadizo"].includes(sistema)) {
    throw new Error("Sistema inválido");
  }

  if (alto > 210 && sistema === "abrir") {
    throw new Error("Más de 210 de alto no puede ser de abrir");
  }

  const tieneBarral = !!extras.barralRecto || !!extras.barralCurvo;

  if ((extras.barralRecto || 0) > 1 || (extras.barralCurvo || 0) > 1) {
    throw new Error("Portón admite máximo 1 barral");
  }

  if (extras.barralRecto && extras.barralCurvo) {
    throw new Error("Solo puede elegirse un barral");
  }

  if (extras.picaporte && tieneBarral) {
    throw new Error("Picaporte y barral no son compatibles");
  }

  if (extras.mediaManija && !tieneBarral) {
    throw new Error("Media manija requiere barral");
  }

  const resultado = calcularPortones(dataInput);

  let costo = Number(resultado.costoBase || 0);
  const items = [...(resultado.items || [])];

  if (alto > 210) {
    costo *= 1.4;
  } else if (alto > 205) {
    costo *= 1.1;
  } else if (alto > 200) {
    costo *= 1.05;
  }

  const estructura = items
    .filter((i) => i.tipo === "estructura")
    .reduce((acc, i) => acc + Number(i.precio || 0), 0);

  const colorFactor = getColorFactor(color);
  const costoColor = estructura * colorFactor;

  if (costoColor > 0) {
    costo += costoColor;

    items.push({
      tipo: "color",
      descripcion: color,
      precio: Math.round(costoColor),
    });
  }

  if (extras.barralRecto) {
    const extra = superficies.barrales?.recto || 0;
    costo += extra;
    items.push({ tipo: "barral_recto", precio: Math.round(extra) });
  }

  if (extras.barralCurvo) {
    const extra = superficies.barrales?.curvo || 0;
    costo += extra;
    items.push({ tipo: "barral_curvo", precio: Math.round(extra) });
  }

  if (extras.picaporte) {
    const extra = superficies.herrajes?.picaporte?.[linea] || 0;
    costo += extra;
    items.push({ tipo: "picaporte", precio: Math.round(extra) });
  }

  if (extras.mediaManija) {
    const extra = superficies.herrajes?.media_manija || 0;
    costo += extra;
    items.push({ tipo: "media_manija", precio: Math.round(extra) });
  }

  if (extras.cartelprohibido) {
    const extra = superficies.extras?.cartelprohibido || 0;
    costo += extra;
    items.push({ tipo: "cartel_prohibido", precio: Math.round(extra) });
  }

  if (hojas > 3) {
    if (sistema === "corredizo") {
      const extra = superficies.herrajes?.corredizo_mas_3 || 0;
      costo += extra;
      items.push({
        tipo: "herraje_corredizo_mas_3",
        precio: Math.round(extra),
      });
    }

    if (sistema === "plegadizo") {
      const extra = superficies.herrajes?.plegadizo_mas_3 || 0;
      costo += extra;
      items.push({
        tipo: "herraje_plegadizo_mas_3",
        precio: Math.round(extra),
      });
    }
  } else {
    if (sistema === "corredizo") {
      const extra = superficies.herrajes?.corredizo || 0;
      costo += extra;
      items.push({
        tipo: "herraje_corredizo",
        precio: Math.round(extra),
      });
    }

    if (sistema === "plegadizo") {
      const extra = superficies.herrajes?.plegadizo || 0;
      costo += extra;
      items.push({
        tipo: "herraje_plegadizo",
        precio: Math.round(extra),
      });
    }
  }

  const modelosDobleTravesano = ["modelo 4", "modelo 4 vr", "modelo 5"];

  if (
    extras.dobleTravesano &&
    sistema === "abrir" &&
    modelosDobleTravesano.includes(modelo)
  ) {
    const anchoCobrado = resultado.configuracion.anchoCobrado;

    const anchoMetros = anchoCobrado / 100;

    const travesano =
      (superficies.superficies?.travesano?.[linea] || 0) * anchoMetros;

    const bisagra = (superficies.herrajes?.bisagra_extra || 0) * hojas;

    costo += travesano * hojas;
    costo += bisagra;

    items.push({
      tipo: "doble_travesano",
      precio: Math.round(travesano * hojas),
    });

    items.push({
      tipo: "bisagra_extra",
      precio: Math.round(bisagra),
    });
  }

  const perfilData = perfiles[perfil]?.[linea] || perfiles.amarilla[linea];

  const costoFinal = costo * (1 - perfilData.descuento);
  const proveedor = costoFinal * (1 + perfilData.flete);
  const venta = proveedor * (1 + perfilData.ganancia);

  return {
    costoBase: Math.round(resultado.costoBase || 0),
    costo: Math.round(costoFinal),
    precioProveedor: Math.round(proveedor),
    precioVenta: Math.round(venta),
    ganancia: Math.round(venta - costoFinal),
    items,
    descripcion: `Portón ${hojas} hojas`,
    configuracion: {
      ...resultado.configuracion,
      linea,
      color,
      sistema,
      hojas,
    },
  };
}

module.exports = calcularPortonWrapper;
