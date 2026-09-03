// wrappers/ventanas/calcularVentanaModena.js

const { fromRoot } = require("../../backend/utils/path");
const buildWrapperResponse = require(
  fromRoot("backend/utils/buildWrapperResponse"),
);

const AuditBuilder = require(fromRoot("backend/audit/AuditBuilder"));

const calcularVentana = require(
  fromRoot("backend/services/ventanas/calcularVentana"),
);

const calcularPrecioCortina = require(
  fromRoot("backend/services/cortinas/calcularPrecioCortina"),
);

const perfiles = require(fromRoot("backend/config/perfiles"));

const superficies = require(
  fromRoot("backend/data/productos/superficies.json"),
);

const colores = require(fromRoot("backend/data/colores.json"));

// 📐

const calcularML = (a, h) => (a * 2 + h * 2) / 100;

// 💰 PERFIL
function aplicarPerfil(costo, p) {
  const proveedor = costo * (1 - p.descuento);

  const venta = proveedor * (1 + p.flete) * (1 + p.ganancia);

  return {
    proveedor,
    venta,
  };
}

// 🎨 COLOR
function aplicarColor(items, color) {
  if (!color || color === "blanco") {
    return items;
  }

  const colorData = colores.find((c) => c.nombre === color);

  const porcentaje = Number(colorData?.valor || 0);

  return items.map((item) => {
    if (
      !["estructura", "mosquitero", "guia", "contramarco"].includes(item.tipo)
    ) {
      return item;
    }

    return {
      ...item,
      precio: Math.round(item.precio * (1 + porcentaje)),
    };
  });
}

//Helper
function formatearMedida(valor) {
  const n = Number(valor);

  if (n < 10) {
    return n.toFixed(2).replace(".", ",");
  }

  return String(Math.round(n));
}
// 🚀 WRAPPER
function calcularVentanaModena(dataInput) {
  const audit = new AuditBuilder();

  const {
    ancho,
    alto,
    color = "blanco",
    tipoConstruccion,
    tipoVidrio,
    vidrioRepartido = false,
    guia,
    mosquitero,
    cortina,
    cajonBlock,
    premarco,
    contramarco,
    bipuntoIzquierda = "ninguno",
    bipuntoDerecha = "ninguno",
    perfil = "amarilla",
  } = dataInput;

  if (!ancho || !alto) {
    throw new Error("Faltan medidas");
  }

  const construccion = tipoConstruccion ?? "2_hojas";

  audit.add({
    etapa: "Construcción",

    tipo: "configuracion",

    origen: "input",

    referencia: construccion,

    metadata: {
      ancho,
      alto,
      construccion,
    },
  });

  let bipunto = 0;
  let bipuntoConLlave = 0;

  [bipuntoIzquierda, bipuntoDerecha].forEach((v) => {
    if (v === "normal") {
      bipunto++;
    }

    if (v === "llave") {
      bipuntoConLlave++;
    }
  });
  const medida = `${formatearMedida(ancho)}x${formatearMedida(alto)}`;

  const esTresHojas =
    construccion === "3_hojas_2_guias" || construccion === "3_hojas_3_guias";

  // Regla comercial:
  // Hasta 240 cm: puede ser 2 o 3 hojas.
  // Más de 240 cm: debe ser 3 hojas.

  if (ancho > 240 && !esTresHojas) {
    throw new Error(
      "Las ventanas mayores a 240 cm deben construirse con 3 hojas.",
    );
  }

  const requiereDivision = ancho > 240;

  let precioGuia = 0;
  let base;
  if (!requiereDivision) {
    base = calcularVentana({
      medida,
      tipoVidrio,
      incluirGuia: guia,
      incluirMosquitero: mosquitero,
      linea: "modena",
    });
  } else {
    const anchoMitad = ancho / 2;

    const medidaMitad = `${formatearMedida(anchoMitad)}x${formatearMedida(alto)}`;

    const izquierda = calcularVentana({
      medida: medidaMitad,
      tipoVidrio,
      incluirGuia: guia,
      incluirMosquitero: mosquitero,
      linea: "modena",
      usarPrecioVidrioLista: true,
    });

    const derecha = calcularVentana({
      medida: medidaMitad,
      tipoVidrio,
      incluirGuia: guia,
      incluirMosquitero: mosquitero,
      linea: "modena",
      usarPrecioVidrioLista: true,
    });

    audit.add({
      etapa: "División automática",

      tipo: "calculo",

      origen: "wrapper",

      referencia: `${ancho} → ${anchoMitad} + ${anchoMitad}`,

      metadata: {
        anchoOriginal: ancho,
        anchoMitad,
        medidaIzquierda: izquierda.medidaUtilizada,
        medidaDerecha: derecha.medidaUtilizada,
      },
    });

    const itemsDivision = [...izquierda.items, ...derecha.items];
    precioGuia = izquierda.items.find((i) => i.tipo === "guia")?.precio || 0;

    // Eliminamos las guías de cada mitad.
    // Las vamos a agregar según la construcción elegida.
    const itemsSinGuias = itemsDivision.filter((i) => i.tipo !== "guia");

    base = {
      costoBase: itemsSinGuias.reduce(
        (acc, item) => acc + Number(item.precio || 0),
        0,
      ),

      medidaUtilizada: `${izquierda.medidaUtilizada} + ${derecha.medidaUtilizada}`,

      items: itemsSinGuias,
    };
    const alturaCotizada = Number(
      izquierda.medidaUtilizada.split("x")[1].replace(",", "."),
    );

    const diferencia = alto - alturaCotizada;

    if (diferencia > 0) {
      const porcentaje = diferencia / 100;

      const recargo = Math.round(base.costoBase * porcentaje);

      base.costoBase += recargo;

      base.items.push({
        tipo: "recargo_altura",
        precio: recargo,
      });

      audit.add({
        etapa: "Recargo Altura División",
        tipo: "recargo",
        origen: "regla_comercial",
        referencia: `${alturaCotizada} → ${alto}`,
        porcentaje,
        valorAplicado: recargo,
        valorDespues: base.costoBase,
      });
    }
  }
  audit.add({
    etapa: "División",

    tipo: "configuracion",

    origen: "wrapper",

    referencia: requiereDivision ? "automática" : "no",

    metadata: {
      ancho,
      requiereDivision,
    },
  });
  audit.add({
    etapa: "Lookup",

    tipo: "lookup",

    origen: "ventanas_modena.json",

    referencia: base.medidaUtilizada,

    metadata: {
      anchoSolicitado: ancho,
      altoSolicitado: alto,
      medidaUtilizada: base.medidaUtilizada,
    },
  });

  audit.add({
    etapa: "Costo Base",

    tipo: "base",

    origen: "ventanas_modena.json",

    valorAntes: 0,
    valorAplicado: base.costoBase,

    valorDespues: base.costoBase,
    metadata: {
      medida: base.medidaUtilizada,
      construccion,
      dividido: requiereDivision,
    },
  });

  // 🎨 COLOR

  const itemsBase = [...base.items];
  const estructuraOriginal = itemsBase
    .filter((i) => i.tipo === "estructura")
    .reduce((acc, i) => acc + Number(i.precio || 0), 0);

  const guiaOriginal = itemsBase
    .filter((i) => i.tipo === "guia")
    .reduce((acc, i) => acc + Number(i.precio || 0), 0);

  const vidrio = itemsBase
    .filter((i) => i.tipo === "vidrio")
    .reduce((acc, i) => acc + Number(i.precio || 0), 0);

  // =========================
  // GUÍAS AUTOMÁTICAS
  // =========================

  if (requiereDivision && guia) {
    const cantidadGuias = construccion === "3_hojas_3_guias" ? 3 : 2;

    for (let i = 0; i < cantidadGuias; i++) {
      itemsBase.push({
        tipo: "guia",
        precio: precioGuia,
      });
    }

    audit.add({
      etapa: "Guías",

      tipo: "extra",

      origen: "regla_comercial",

      referencia: construccion,

      metadata: {
        cantidad: cantidadGuias,
        precioUnitario: precioGuia,
      },
    });
  }

  const items = aplicarColor(itemsBase, color);

  const aplicarRecargoConstruccion =
    !requiereDivision &&
    (construccion === "3_hojas_2_guias" || construccion === "3_hojas_3_guias");

  const recargoConstruccion = aplicarRecargoConstruccion
    ? Number(superficies.recargos.tres_hojas || 1)
    : 1;
  const estructuraColor =
    items.find((i) => i.tipo === "estructura")?.precio || 0;

  const guiaColor = items.find((i) => i.tipo === "guia")?.precio || 0;
  const incrementoColor =
    estructuraColor - estructuraOriginal + (guiaColor - guiaOriginal);

  let costo = items.reduce((acc, i) => acc + Number(i.precio || 0), 0);

  if (recargoConstruccion > 1) {
    const estructura = items
      .filter((i) => i.tipo === "estructura")
      .reduce((acc, i) => acc + Number(i.precio || 0), 0);

    const vidrio = items
      .filter((i) => i.tipo === "vidrio")
      .reduce((acc, i) => acc + Number(i.precio || 0), 0);

    costo = items.reduce((acc, i) => acc + Number(i.precio || 0), 0);

    const baseRecargo = estructura + vidrio;

    const incremento = Math.round(baseRecargo * (recargoConstruccion - 1));

    costo += incremento;

    items.push({
      tipo: "recargo_construccion",
      precio: incremento,
    });

    audit.add({
      etapa: "Construcción",

      tipo: "recargo",

      origen: "superficies.json",

      referencia: construccion,

      porcentaje: recargoConstruccion,

      valorAntes: costo - incremento,

      valorAplicado: incremento,

      valorDespues: costo,

      metadata: {
        estructura,
        vidrio,
        baseRecargo,
      },
    });
  }

  // =========================
  // RECARGO 3 GUÍAS
  // =========================

  if (construccion === "3_hojas_3_guias") {
    const recargoTresGuias = Number(superficies.recargos.tres_guias || 1);

    if (recargoTresGuias > 1) {
      const incremento = Math.round(costo * (recargoTresGuias - 1));

      costo += incremento;

      items.push({
        tipo: "recargo_3_guias",
        precio: incremento,
      });

      audit.add({
        etapa: "3 Guías",
        tipo: "recargo",
        origen: "superficies.json",
        referencia: "3_hojas_3_guias",
        porcentaje: recargoTresGuias,
        valorAntes: costo - incremento,
        valorAplicado: incremento,
        valorDespues: costo,
      });
    }
  }

  const colorData = colores.find((c) => c.nombre === color);

  const porcentajeColor = Number(colorData?.valor || 0);

  audit.add({
    etapa: "Color",

    tipo: "color",

    descripcion: `Recargo color ${color}`,

    origen: "colores.json",

    referencia: color,

    porcentaje: porcentajeColor,

    valorAntes: base.costoBase,

    valorAplicado: incrementoColor,

    valorDespues: costo,

    metadata: {
      estructuraOriginal,
      estructuraColor,

      guiaOriginal,
      guiaColor,

      vidrio,

      porcentajeColor,

      incremento: incrementoColor,

      costoBase: base.costoBase,
    },
  });

  if (vidrioRepartido) {
    const recargo = Math.round(costo * 0.3);

    costo += recargo;

    items.push({
      tipo: "vidrio_repartido",
      precio: recargo,
    });

    audit.add({
      etapa: "Vidrio Repartido",

      tipo: "extra",

      origen: "wrapper",

      valorAntes: costo - recargo,

      valorAplicado: recargo,

      valorDespues: costo,
    });
  }

  const ml = calcularML(ancho, alto);

  // 🪟 CORTINA PVC (siempre reforzada)
  if (cortina === "pvc") {
    const resultadoCortina = calcularPrecioCortina({
      tipo: "cortina",
      material: "pvc",
      calidad: "reforzada",
      construccion: "completa",
      ancho,
      alto,
    });

    const c = resultadoCortina.costoBase;

    costo += c;

    audit.add({
      etapa: "Cortina PVC",
      tipo: "extra",
      origen: "calcularPrecioCortina",
      valorAntes: costo - c,
      valorAplicado: c,
      valorDespues: costo,
    });

    items.push({
      tipo: "cortina_pvc",
      precio: c,
    });
  }
  // 🪟 CORTINA ALUMINIO
  if (cortina === "aluminio") {
    const resultadoCortina = calcularPrecioCortina({
      tipo: "cortina",
      material: "aluminio",
      construccion: "completa",
      color: color === "simil_madera" ? "simil_madera" : "blanco",
      ancho,
      alto,
    });

    const c = resultadoCortina.costoBase;

    costo += c;

    audit.add({
      etapa: "Cortina Aluminio",
      tipo: "extra",
      origen: "calcularPrecioCortina",
      valorAntes: costo - c,
      valorAplicado: c,
      valorDespues: costo,
    });

    items.push({
      tipo: "cortina_aluminio",
      precio: c,
    });
  }

  // 📦 CAJÓN BLOCK
  if (cajonBlock) {
    const resultadoCajon = calcularPrecioCortina({
      tipo: "cajon_block",
      material: "aluminio",
      color: color === "simil_madera" ? "simil_madera" : "blanco",
      ancho,
      alto,
    });

    const c = resultadoCajon.costoBase;

    costo += c;

    audit.add({
      etapa: "Cajón Block",
      tipo: "extra",
      origen: "calcularPrecioCortina",
      valorAntes: costo - c,
      valorAplicado: c,
      valorDespues: costo,
    });

    items.push({
      tipo: "cajon_block",
      precio: c,
    });
  }
  // 🪚 PREMARCO
  if (premarco) {
    const c = Number(superficies.superficies.premarco || 0) * ml;

    costo += c;

    audit.add({
      etapa: "Premarco",

      tipo: "extra",

      origen: "superficies.json",

      valorAntes: costo - c,

      valorAplicado: c,

      valorDespues: costo,
    });

    if (c > 0) {
      items.push({
        tipo: "premarco",
        precio: Math.round(c),
      });
    }
  }
  // 🪚 CONTRAMARCO
  if (premarco || contramarco) {
    let c = Number(superficies.superficies.contramarco || 0) * ml;

    if (color !== "blanco") {
      const porcentaje = Number(
        colores.find((x) => x.nombre === color)?.valor || 0,
      );

      c *= 1 + porcentaje;
    }

    costo += c;

    audit.add({
      etapa: "Contramarco",
      tipo: "extra",
      origen: "superficies.json",
      valorAntes: costo - c,
      valorAplicado: c,
      valorDespues: costo,
    });

    if (c > 0) {
      items.push({
        tipo: "contramarco",
        precio: Math.round(c),
      });
    }
  }

  if (bipunto > 0) {
    const c = Number(superficies.extras.bipunto || 0) * Number(bipunto);

    costo += c;

    items.push({
      tipo: "extra",
      descripcion: `Bipunto x${bipunto}`,
      cantidad: bipunto,
      precio: c,
    });

    audit.add({
      etapa: "Bipunto",
      tipo: "extra",
      origen: "superficies.json",
      valorAntes: costo - c,
      valorAplicado: c,
      valorDespues: costo,
      metadata: {
        cantidad: bipunto,
      },
    });
  }

  if (bipuntoConLlave > 0) {
    const c =
      Number(superficies.extras.bipunto_con_llave || 0) *
      Number(bipuntoConLlave);

    costo += c;

    items.push({
      tipo: "extra",
      descripcion: `Bipunto con llave x${bipuntoConLlave}`,
      cantidad: bipuntoConLlave,
      precio: c,
    });

    audit.add({
      etapa: "Bipunto con llave",
      tipo: "extra",
      origen: "superficies.json",
      valorAntes: costo - c,
      valorAplicado: c,
      valorDespues: costo,
      metadata: {
        cantidad: bipuntoConLlave,
      },
    });
  }

  // 📏 ALTURA
  if (!requiereDivision && alto > 205) {
    costo *= 1.1;

    audit.add({
      etapa: "Recargo Altura",

      tipo: "recargo",

      origen: "wrapper",

      valorAntes: costo / 1.1,

      valorAplicado: costo - costo / 1.1,

      valorDespues: costo,
    });
  }

  // 💰 PERFIL
  const perfilModena = perfiles[perfil]?.modena || perfiles.amarilla.modena;

  const perfilMosquiteroBase =
    perfiles[perfil]?.mosquiteros || perfiles.amarilla.mosquiteros;

  const perfilMosquitero = {
    ...perfilMosquiteroBase,
    descuento: perfilModena.descuento,
  };
  const perfilPremarcos =
    perfiles[perfil]?.premarcos || perfiles.amarilla.premarcos;
  let costoMosquitero = items
    .filter((i) => i.tipo === "mosquitero")
    .reduce((acc, i) => acc + Number(i.precio || 0), 0);

  if (
    !requiereDivision &&
    construccion === "3_hojas_3_guias" &&
    mosquitero &&
    costoMosquitero > 0
  ) {
    costoMosquitero *= 2;

    const itemMosquitero = items.find((i) => i.tipo === "mosquitero");

    if (itemMosquitero) {
      itemMosquitero.precio *= 2;
    }

    audit.add({
      etapa: "Mosquitero",

      tipo: "extra",

      origen: "regla_comercial",

      referencia: "3_hojas_3_guias",

      valorAplicado: costoMosquitero / 2,

      valorDespues: costoMosquitero,
    });
  }

  const costoPremarcos = items
    .filter((i) => i.tipo === "premarco" || i.tipo === "contramarco")
    .reduce((acc, i) => acc + Number(i.precio || 0), 0);
  const costoModena = costo - costoMosquitero - costoPremarcos;

  const { proveedor: proveedorModena, venta: ventaModena } = aplicarPerfil(
    costoModena,
    perfilModena,
  );

  const { proveedor: proveedorPremarcos, venta: ventaPremarcos } =
    aplicarPerfil(costoPremarcos, perfilPremarcos);

  const { proveedor: proveedorMosquitero, venta: ventaMosquitero } =
    aplicarPerfil(costoMosquitero, perfilMosquitero);

  const proveedor = proveedorModena + proveedorMosquitero + proveedorPremarcos;

  const venta = ventaModena + ventaMosquitero + ventaPremarcos;

  const perfilData = perfilModena;
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

      costoModena,
      costoMosquitero,
      costoPremarcos,

      proveedorModena,
      ventaModena,

      proveedorMosquitero,
      ventaMosquitero,

      proveedorPremarcos,
      ventaPremarcos,

      proveedor,
      venta,
    },
  });

  return buildWrapperResponse({
    // =========================
    // IDENTIDAD
    // =========================

    modulo: "ventanas",

    linea: "modena",

    // =========================
    // COSTOS
    // =========================

    costoBase: base.costoBase,

    costo,

    // =========================
    // PRECIOS
    // =========================

    precioBase: costo,

    precioProveedor: proveedor,

    precioLista: venta,

    precioFinal: venta,

    // =========================
    // PERFIL
    // =========================

    perfilAplicado: perfil,

    descuentoAplicado: perfilData.descuento,

    fleteAplicado: perfilData.flete,

    gananciaAplicada: perfilData.ganancia,

    margenAplicado: Math.round(perfilData.ganancia * 100),

    // =========================
    // RESULTADO
    // =========================

    ganancia: venta - costo,

    descripcion:
      construccion === "2_hojas"
        ? `Ventana modena ${ancho}x${alto}`
        : `Ventana modena ${ancho}x${alto} (${construccion.replaceAll("_", " ")})`,

    items,

    configuracion: {
      ancho,
      alto,
      color,
      tipoConstruccion: construccion,
      tipoVidrio,
      mosquitero: !!mosquitero,
      premarco: !!premarco,
      contramarco: !!contramarco,

      bipuntoIzquierda,
      bipuntoDerecha,
      svg: {
        tipo: "ventana_modena",

        hojas:
          construccion === "3_hojas_2_guias" ||
          construccion === "3_hojas_3_guias"
            ? 3
            : 2,

        guias: construccion === "3_hojas_3_guias" ? 3 : 2,

        tipoConstruccion: construccion,

        mosquitero: !!mosquitero,
        premarco: !!premarco,
        contramarco: !!contramarco,

        bipuntoIzquierda,
        bipuntoDerecha,
      },
    },
    audit: audit.getSteps(),
  });
}

module.exports = calcularVentanaModena;
