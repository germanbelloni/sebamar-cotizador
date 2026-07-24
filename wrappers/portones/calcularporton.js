const { fromRoot } = require("../../backend/utils/path");

const buildWrapperResponse = require(
  fromRoot("backend/utils/buildWrapperResponse"),
);
const AuditBuilder = require(fromRoot("backend/audit/AuditBuilder"));

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
  const audit = new AuditBuilder();

  const {
    perfil = "amarilla",
    linea,
    color = "blanco",
    sistema: sistemaInput,
    tipoPorton,
    hojas = 3,
    modelo,
    extras = {},
    alto,
    premarco = false,
    contramarco = false,
  } = dataInput;

  const puertas = require(
    fromRoot(`backend/data/productos/puertas_${linea}.json`),
  );

  const sistema = sistemaInput || tipoPorton;

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

  audit.add({
    etapa: "Costo Base",

    tipo: "base",

    origen: "calcularPortones",

    valorAntes: 0,

    valorAplicado: costo,

    valorDespues: costo,

    metadata: {
      hojas,
      sistema,
      modelo,
      linea,
    },
  });

  const costoAntesRecargo = costo;

  let factorRecargo = 1;

  if (alto > 210) {
    factorRecargo = 1.4;
  } else if (alto > 205) {
    factorRecargo = 1.1;
  } else if (alto > 200) {
    factorRecargo = 1.05;
  }

  costo *= factorRecargo;

  if (factorRecargo !== 1) {
    audit.add({
      etapa: "Recargo Alto",

      tipo: "recargo",

      origen: "wrapper",

      referencia: `${alto}cm`,

      porcentaje: factorRecargo - 1,

      valorAntes: costoAntesRecargo,

      valorAplicado: costo - costoAntesRecargo,

      valorDespues: costo,

      metadata: {
        alto,
        factor: factorRecargo,
      },
    });
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

  audit.add({
    etapa: "Color",

    tipo: "color",

    descripcion: `Recargo color ${color}`,

    origen: "colores.json",

    referencia: color,

    porcentaje: colorFactor,

    valorAntes: estructura,

    valorAplicado: costoColor,

    valorDespues: estructura + costoColor,

    metadata: {
      estructuraOriginal: estructura,
      estructuraColor: estructura + costoColor,
      incremento: costoColor,
      porcentajeColor: colorFactor,
    },
  });

  if (extras.barralRecto) {
    const extra = superficies.barrales?.recto || 0;
    costo += extra;
    items.push({ tipo: "barral_recto", precio: Math.round(extra) });
    audit.add({
      etapa: "Barral Recto",

      tipo: "extra",

      origen: "superficies.json",

      valorAntes: costo - extra,

      valorAplicado: extra,

      valorDespues: costo,
    });
  }

  if (extras.barralCurvo) {
    const extra = superficies.barrales?.curvo || 0;
    costo += extra;
    items.push({ tipo: "barral_curvo", precio: Math.round(extra) });
    audit.add({
      etapa: "Barral Curvo",

      tipo: "extra",

      origen: "superficies.json",

      valorAntes: costo - extra,

      valorAplicado: extra,

      valorDespues: costo,
    });
  }

  if (extras.picaporte) {
    const extra = superficies.herrajes?.picaporte?.[linea] || 0;
    costo += extra;
    items.push({ tipo: "picaporte", precio: Math.round(extra) });
    audit.add({
      etapa: "Picaporte",

      tipo: "extra",

      origen: "superficies.json",

      valorAntes: costo - extra,

      valorAplicado: extra,

      valorDespues: costo,
    });
  }

  if (extras.mediaManija) {
    const extra = superficies.herrajes?.media_manija || 0;
    costo += extra;
    items.push({ tipo: "media_manija", precio: Math.round(extra) });
    audit.add({
      etapa: "Media Manija",

      tipo: "extra",

      origen: "superficies.json",

      valorAntes: costo - extra,

      valorAplicado: extra,

      valorDespues: costo,
    });
  }

  if (extras.cartelprohibido) {
    const extra = superficies.extras?.cartelprohibido || 0;
    costo += extra;
    items.push({ tipo: "cartel_prohibido", precio: Math.round(extra) });
    audit.add({
      etapa: "Cartel",

      tipo: "extra",

      origen: "superficies.json",

      valorAntes: costo - extra,

      valorAplicado: extra,

      valorDespues: costo,
    });
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
      audit.add({
        etapa: "Herraje Plegadizo",

        tipo: "extra",

        origen: "superficies.json",

        valorAntes: costo - extra,

        valorAplicado: extra,

        valorDespues: costo,
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

      audit.add({
        etapa: "Herraje Corredizo",

        tipo: "extra",

        origen: "superficies.json",

        valorAntes: costo - extra,

        valorAplicado: extra,

        valorDespues: costo,
      });
    }

    if (sistema === "plegadizo") {
      const extra = superficies.herrajes?.plegadizo || 0;
      costo += extra;
      items.push({
        tipo: "herraje_plegadizo",
        precio: Math.round(extra),
      });
      audit.add({
        etapa: "Herraje Plegadizo",

        tipo: "extra",

        origen: "superficies.json",

        valorAntes: costo - extra,

        valorAplicado: extra,

        valorDespues: costo,
      });
    }
  }
  if (sistema === "abrir") {
    const modelo1 = puertas.modelos["modelo 1"];
    const modelo2 = puertas.modelos["modelo 2"];

    if (!modelo1 || !modelo2) {
      throw new Error(
        "No se encontraron los modelos 1 y 2 para calcular el doble travesaño.",
      );
    }

    const costoDobleTravesano =
      (Number(modelo2.base || 0) - Number(modelo1.base || 0)) * hojas;

    const costoBisagras = (superficies.herrajes?.bisagra_extra || 0) * hojas;

    const extraAbrir = costoDobleTravesano + costoBisagras;

    costo += extraAbrir;

    items.push({
      tipo: "porton_abrir",
      descripcion: "Doble travesaño + bisagras",
      precio: Math.round(extraAbrir),
    });

    audit.add({
      etapa: "Portón Abrir",
      tipo: "extra",
      origen: "Regla Portones",
      valorAntes: costo - extraAbrir,
      valorAplicado: extraAbrir,
      valorDespues: costo,
      metadata: {
        dobleTravesano: costoDobleTravesano,
        bisagras: costoBisagras,
      },
    });
  }
  if (linea === "modena") {
    const ml = (dataInput.ancho * 2 + dataInput.alto * 2) / 100;

    if (premarco) {
      const c = Number(superficies.superficies.premarco || 0) * ml;

      costo += c;

      items.push({
        tipo: "premarco",
        precio: Math.round(c),
      });

      audit.add({
        etapa: "Premarco",
        tipo: "extra",
        origen: "superficies.json",
        valorAntes: costo - c,
        valorAplicado: c,
        valorDespues: costo,
      });
    }

    if (premarco || contramarco) {
      const c = Number(superficies.superficies.contramarco || 0) * ml;

      costo += c;

      items.push({
        tipo: "contramarco",
        precio: Math.round(c),
      });

      audit.add({
        etapa: "Contramarco",
        tipo: "extra",
        origen: "superficies.json",
        valorAntes: costo - c,
        valorAplicado: c,
        valorDespues: costo,
      });
    }
  }

  let proveedor;
  let venta;
  let perfilData;
  let costoFinal;

  if (linea === "modena") {
    const perfilModena = perfiles[perfil]?.modena || perfiles.amarilla.modena;

    const perfilPremarcos =
      perfiles[perfil]?.premarcos || perfiles.amarilla.premarcos;

    const costoPremarcos = items
      .filter((i) => i.tipo === "premarco" || i.tipo === "contramarco")
      .reduce((acc, i) => acc + Number(i.precio || 0), 0);

    const costoPorton = costo - costoPremarcos;

    const proveedorPorton = costoPorton * (1 - perfilModena.descuento);

    const ventaPorton =
      proveedorPorton * (1 + perfilModena.flete) * (1 + perfilModena.ganancia);

    const proveedorPremarcos = costoPremarcos * (1 - perfilPremarcos.descuento);

    const ventaPremarcos =
      proveedorPremarcos *
      (1 + perfilPremarcos.flete) *
      (1 + perfilPremarcos.ganancia);

    proveedor = proveedorPorton + proveedorPremarcos;
    venta = ventaPorton + ventaPremarcos;

    costoFinal = costo;

    perfilData = perfilModena;
  } else {
    perfilData = perfiles[perfil]?.[linea] || perfiles.amarilla[linea];

    costoFinal = costo * (1 - perfilData.descuento);

    proveedor = costoFinal * (1 + perfilData.flete);

    venta = proveedor * (1 + perfilData.ganancia);
  }
  audit.add({
    etapa: "Perfil",

    tipo: "perfil",

    origen: "perfiles.js",

    referencia: perfil,

    valorAntes: costoFinal,

    valorAplicado: venta - costoFinal,

    valorDespues: venta,

    porcentaje: perfilData.ganancia,

    metadata: {
      descuento: perfilData.descuento,
      flete: perfilData.flete,
      ganancia: perfilData.ganancia,

      proveedor,
      venta,
    },
  });
  return buildWrapperResponse({
    modulo: "portones",

    linea,

    costoBase: resultado.costoBase || 0,

    costo: costoFinal,

    precioBase: costoFinal,

    precioProveedor: proveedor,

    precioLista: venta,

    precioFinal: venta,

    perfilAplicado: perfil,

    descuentoAplicado: perfilData.descuento,

    fleteAplicado: perfilData.flete,

    gananciaAplicada: perfilData.ganancia,

    margenAplicado: 0,

    ganancia: venta - proveedor,

    items,

    descripcion: `Portón ${hojas} hojas`,

    configuracion: {
      ...resultado.configuracion,
      linea,
      color,
      sistema,
      hojas,
      premarco,
      contramarco,
    },

    audit: audit.getSteps(),
  });
}

module.exports = calcularPortonWrapper;
