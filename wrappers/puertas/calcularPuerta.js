const { fromRoot } = require("../../backend/utils/path");

const calcularPuertas = require(
  fromRoot("backend/services/puertas/calcularPuertas"),
);

const buildWrapperResponse = require(
  fromRoot("backend/utils/buildWrapperResponse"),
);
const AuditBuilder = require(fromRoot("backend/audit/AuditBuilder"));
const superficies = require(
  fromRoot("backend/data/productos/superficies.json"),
);

const perfiles = require(fromRoot("backend/config/perfiles"));

const colores = require(fromRoot("backend/data/colores.json"));

// ========================
// 🎨 COLOR
// ========================

function getColorFactor(color) {
  const c = colores.find(
    (x) => x.nombre.toLowerCase().trim() === (color || "").toLowerCase().trim(),
  );

  return c ? c.valor : 0;
}

// ========================
// 💰 PERFIL
// ========================
const calcularML = (a, h) => (a * 2 + h * 2) / 100;

function aplicarPerfil(costo, p) {
  const proveedor = costo * (1 - p.descuento);

  const venta = proveedor * (1 + p.flete) * (1 + p.ganancia);

  return {
    proveedor,
    venta,
  };
}

function aplicarRecargoMedidas(costo, dataInput) {
  const { ancho, alto, configuracion = "simple" } = dataInput;

  const limites = {
    simple: { min: 60, max: 100 },
    puerta_y_media: { min: 100, max: 130 },
    doble: { min: 140, max: 180 },
    porton: { min: 210, max: 400 },
  };

  const regla = limites[configuracion];

  if (!regla) {
    throw new Error("Configuración inválida");
  }

  if (ancho < regla.min || ancho > regla.max) {
    throw new Error(
      `Ancho inválido para ${configuracion}: ${regla.min}-${regla.max}`,
    );
  }

  if (alto < 150 || alto > 210) {
    throw new Error("Alto inválido: 150-210");
  }

  if (alto <= 200) {
    return costo;
  }

  if (alto <= 205) {
    return costo * 1.05;
  }

  return costo * 1.1;
}

// ========================
// 🚀 WRAPPER
// ========================

function calcularPuertaWrapper(dataInput) {
  const audit = new AuditBuilder();
  if (!dataInput.medida && dataInput.ancho && dataInput.alto) {
    dataInput.medida = `${dataInput.ancho}x${dataInput.alto}`;
  }

  const {
    perfil = "amarilla",
    extras = {},
    color = "blanco",
    linea,
    configuracion = "simple",
    modelo,
    mano = "derecha",
    premarco = false,
    contramarco = false,
  } = dataInput;

  const tipo = configuracion;

  const tieneBarral = !!extras.barralRecto || !!extras.barralCurvo;

  if (extras.picaporte && tieneBarral) {
    throw new Error("Picaporte y barral no son compatibles");
  }

  if (extras.mediaManija && !tieneBarral) {
    throw new Error("Media manija requiere barral");
  }

  if (extras.barralRecto && extras.barralCurvo) {
    throw new Error("Solo puede elegirse un barral");
  }

  // ========================
  // 🚪 BASE
  // ========================
  const base = calcularPuertas(dataInput);

  let costo = Number(base.costoBase || 0);

  const items = [...base.items];

  audit.add({
    etapa: "Costo Base",

    tipo: "base",

    origen: "calcularPuertas",

    valorAntes: 0,

    valorAplicado: costo,

    valorDespues: costo,

    metadata: {
      linea,
      configuracion,
      modelo,
      hojas: base.configuracion?.hojas || 1,
      tipoVidrio: base.configuracion?.tipoVidrio,
    },
  });

  const costoAntesRecargo = costo;

  costo = aplicarRecargoMedidas(costo, dataInput);

  if (Math.round(costo) !== Math.round(costoAntesRecargo)) {
    audit.add({
      etapa: "Recargo Alto",

      tipo: "recargo",

      origen: "wrapper",

      referencia: `${dataInput.alto}cm`,

      porcentaje: costoAntesRecargo ? costo / costoAntesRecargo - 1 : 0,

      valorAntes: costoAntesRecargo,

      valorAplicado: costo - costoAntesRecargo,

      valorDespues: costo,

      metadata: {
        alto: dataInput.alto,
      },
    });
  }
  // ========================
  // 🎨 COLOR
  // SOLO ESTRUCTURA
  // ========================

  const estructura = items
    .filter((i) => i.tipo === "estructura")
    .reduce((acc, i) => acc + Number(i.precio || 0), 0);

  const colorFactor = getColorFactor(color);

  const costoColor = estructura * colorFactor;

  if (costoColor > 0) {
    costo += costoColor;

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

    // Registrar recargo por color
    items.push({
      tipo: "color",
      descripcion: color,
      precio: Math.round(costoColor),
    });
  }
  // ========================
  // ➕ EXTRAS
  // ========================

  if (extras.barralRecto) {
    const extra = (superficies.barrales?.recto || 0) * extras.barralRecto;

    costo += extra;

    items.push({
      tipo: "barral_recto",
      precio: Math.round(extra),
    });
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
    const extra = (superficies.barrales?.curvo || 0) * extras.barralCurvo;

    costo += extra;

    items.push({
      tipo: "barral_curvo",
      precio: Math.round(extra),
    });
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

    items.push({
      tipo: "picaporte",
      precio: Math.round(extra),
    });

    audit.add({
      etapa: "Picaporte",

      tipo: "extra",

      origen: "superficies.json",

      referencia: linea,

      valorAntes: costo - extra,

      valorAplicado: extra,

      valorDespues: costo,
    });
  }

  if (extras.mediaManija) {
    const extra = superficies.herrajes?.media_manija || 0;

    costo += extra;

    items.push({
      tipo: "media_manija",
      precio: Math.round(extra),
    });

    audit.add({
      etapa: "Media Manija",

      tipo: "extra",

      origen: "superficies.json",

      valorAntes: costo - extra,

      valorAplicado: extra,

      valorDespues: costo,
    });
  }

  // ========================
  // 🚪 BARRA ANTIPÁNICO
  // ========================

  if (extras.barraAntipanico) {
    const cantidad = Number(extras.barraAntipanico);

    const extra =
      Number(superficies.herrajes?.barra_antipanico || 0) * cantidad;

    costo += extra;

    items.push({
      tipo: "barra_antipanico",
      descripcion:
        cantidad === 1 ? "Barra antipánico" : `${cantidad} Barras antipánico`,
      precio: Math.round(extra),
    });

    audit.add({
      etapa: "Barra Antipánico",

      tipo: "extra",

      origen: "superficies.json",

      referencia: `${cantidad} unidad(es)`,

      valorAntes: costo - extra,

      valorAplicado: extra,

      valorDespues: costo,
    });
  }

  if (linea === "modena") {
    const ml = calcularML(dataInput.ancho, dataInput.alto);

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

  // ========================
  // 💰 PERFIL
  // ========================
  const lineaPerfil = linea === "eco" ? "herrero" : linea;

  let costoBarrales = 0;
  let costoPuerta = 0;

  let proveedorBarral = 0;
  let ventaBarral = 0;
  let proveedor;
  let venta;
  let perfilData;
  let costoPremarcos = 0;

  if (linea === "modena") {
    const perfilModena = perfiles[perfil]?.modena || perfiles.amarilla.modena;

    const perfilPremarcos =
      perfiles[perfil]?.premarcos || perfiles.amarilla.premarcos;

    costoPremarcos = items
      .filter((i) => i.tipo === "premarco" || i.tipo === "contramarco")
      .reduce((acc, i) => acc + Number(i.precio || 0), 0);
    costoBarrales = items
      .filter((i) => i.tipo === "barral_recto" || i.tipo === "barral_curvo")
      .reduce((acc, i) => acc + Number(i.precio || 0), 0);
    costoPuerta = costo - costoPremarcos - costoBarrales;

    const rPuerta = aplicarPerfil(costoPuerta, perfilModena);

    const rPremarcos = aplicarPerfil(costoPremarcos, perfilPremarcos);

    // Barrales: sin descuento, con flete y ganancia
    proveedorBarral = costoBarrales * (1 + perfilModena.flete);

    ventaBarral = proveedorBarral * (1 + perfilModena.ganancia);

    proveedor = rPuerta.proveedor + rPremarcos.proveedor + proveedorBarral;

    venta = rPuerta.venta + rPremarcos.venta + ventaBarral;

    perfilData = perfilModena;
  } else {
    perfilData =
      perfiles[perfil]?.[lineaPerfil] || perfiles.amarilla[lineaPerfil];

    if (!perfilData) {
      throw new Error(`No existe perfil para la línea "${linea}".`);
    }
    costoBarrales = items
      .filter((i) => i.tipo === "barral_recto" || i.tipo === "barral_curvo")
      .reduce((acc, i) => acc + Number(i.precio || 0), 0);

    costoPuerta = costo - costoBarrales;
    const rPuerta = aplicarPerfil(costoPuerta, perfilData);

    // El barral NO lleva descuento
    proveedorBarral = costoBarrales * (1 + perfilData.flete);

    ventaBarral = proveedorBarral * (1 + perfilData.ganancia);

    proveedor = rPuerta.proveedor + proveedorBarral;
    venta = rPuerta.venta + ventaBarral;
  }

  audit.add({
    etapa: "Perfil",

    tipo: "perfil",

    origen: "perfiles.js",

    referencia: perfil,

    valorAntes: costo,

    valorAplicado: venta - costo,

    valorDespues: venta,

    porcentaje: perfilData.ganancia,

    metadata: {
      descuento: perfilData.descuento,
      flete: perfilData.flete,
      ganancia: perfilData.ganancia,

      costoPuerta,
      costoBarrales,
      costoPremarcos,
      proveedorBarral,
      ventaBarral,

      proveedor,
      venta,
    },
  });
  console.log("================================");
  console.log("BASE COSTO:", base.costoBase);
  console.log("COSTO:", costo);
  console.log("PROVEEDOR:", proveedor);
  console.log("VENTA:", venta);
  console.log("================================");
  return buildWrapperResponse({
    modulo: "puertas",

    linea,

    costoBase: base.costoBase,

    costo,

    precioBase: costo,

    precioProveedor: proveedor,

    precioLista: venta,

    precioFinal: venta,

    perfilAplicado: perfil,

    descuentoAplicado: perfilData.descuento,

    fleteAplicado: perfilData.flete,

    gananciaAplicada: perfilData.ganancia,

    margenAplicado: 0,

    ganancia: venta - proveedor,

    items: items.map((i) => ({
      tipo: i.tipo,
      descripcion: i.descripcion,
      precio: Math.round(i.precio || 0),
    })),

    descripcion: `Puerta ${linea} ${modelo}`,

    configuracion: {
      tipo,

      hojas: base.configuracion?.hojas || 1,

      linea,

      color,

      modelo,

      premarco: !!premarco,
      contramarco: !!contramarco,

      svg: {
        tipo: "puerta",

        apertura: mano,

        hojas: base.configuracion?.hojas || 1,

        manija: null,

        barral: extras.barralRecto
          ? {
              tipo: "recto",
              svgKey: "barral_recto",
            }
          : extras.barralCurvo
            ? {
                tipo: "curvo",
                svgKey: "barral_curvo",
              }
            : null,

        barraAntipanico: extras.barraAntipanico
          ? {
              cantidad: extras.barraAntipanico,
              lado: extras.barraAntipanicoLado,
            }
          : null,
      },
    },

    audit: audit.getSteps(),
  });
}

module.exports = calcularPuertaWrapper;
