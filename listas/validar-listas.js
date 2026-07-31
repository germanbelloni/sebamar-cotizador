"use strict";

const fs = require("fs");
const path = require("path");

const calcularVentanaHerrero = require("../wrappers/ventanas/calcularVentanaHerrero");
const calcularVentanaModena = require("../wrappers/ventanas/calcularVentanaModena");
const calcularRajaHerrero = require("../wrappers/rajas/calcularRajaHerrero");
const calcularRajaModena = require("../wrappers/rajas/calcularRajaModena");
const calcularPostigones = require("../wrappers/postigones/calcularPostigones");
const calcularPatagonicaModena = require("../wrappers/patagonicas/calcularPatagonicaModena");
const calcularPuertaPlaca = require("../wrappers/placas/calcularPuertaPlaca");
const calcularPuerta = require("../wrappers/puertas/calcularPuerta");
const calcularMosquiteroVentana = require("../wrappers/mosquiteros/calcularMosquiteroVentana");
const { aplicarPerfil } = require("./motor/aplicarPerfil");

const PERFIL = (process.argv[2] || "azul").toLowerCase();

const MODULOS = [
  {
    nombre: "Ventanas Herrero",
    titulo: "VENTANAS HERRERO",
    wrapper: calcularVentanaHerrero,
    validar: validarVentanasHerrero,
  },
  {
    nombre: "Ventanas Modena",
    titulo: "VENTANAS MODENA",
    wrapper: calcularVentanaModena,
    validar: validarVentanasModena,
  },
  {
    nombre: "Puertas Herrero",
    titulo: "PUERTAS HERRERO",
    wrapper: calcularPuerta,
    validar: validarPuertasHerrero,
    motivo:
      "La hoja no incluye las medidas y configuración requeridas por el wrapper.",
  },
  {
    nombre: "Puertas Modena",
    titulo: "PUERTAS MODENA",
    wrapper: calcularPuerta,
    validar: validarPuertasModena,
    motivo:
      "La hoja no incluye las medidas y configuración requeridas por el wrapper.",
  },
  {
    nombre: "Puertas Eco",
    titulo: "PUERTAS LIVIANAS 25 mm",
    wrapper: calcularPuerta,
    validar: validarPuertasEco,
    motivo:
      "La hoja no incluye las medidas y configuración requeridas por el wrapper.",
  },

  {
    nombre: "Rajas Herrero",
    titulo: "RAJA HERRERO BLANCO",
    wrapper: calcularRajaHerrero,
    validar: validarRajasHerrero,
  },
  {
    nombre: "Rajas Modena",
    titulo: "RAJAS MODENA",
    wrapper: calcularRajaModena,
    validar: validarRajasModena,
  },
  {
    nombre: "Postigones",
    titulo: "POSTIGONES",
    wrapper: calcularPostigones,
    validar: validarPostigones,
  },
  {
    nombre: "Patagónicas",
    titulo: "PATAGONICAS MODENA",
    wrapper: calcularPatagonicaModena,
    validar: validarPatagonicasModena,
  },

  {
    nombre: "Mosquiteros",
    titulo: "MOSQUITERO P/VENTANA COLOCADA",
    wrapper: calcularMosquiteroVentana,
    validar: validarMosquiterosVentana,
  },
  {
    nombre: "Puertas Placa",
    titulo: "PUERTAS PLACA",
    wrapper: calcularPuertaPlaca,
    validar: validarPuertasPlaca,
  },
];

function leerLista() {
  const nombreArchivo = `Lista ${PERFIL[0].toUpperCase()}${PERFIL.slice(1)}.json`;
  const ruta = path.join(__dirname, "output", nombreArchivo);

  if (!fs.existsSync(ruta)) {
    throw new Error(`No existe el archivo:\n${ruta}`);
  }

  const lista = JSON.parse(fs.readFileSync(ruta, "utf8"));

  if (!Array.isArray(lista)) {
    throw new Error(`${nombreArchivo}: se esperaba un arreglo de hojas.`);
  }

  return lista;
}

function convertirMedida(texto) {
  const [anchoTxt, altoTxt] = String(texto).split("x");
  const ancho = Number(anchoTxt);
  const alto = altoTxt.includes(",")
    ? Math.round(Number(altoTxt.replace(",", ".")) * 100)
    : Number(altoTxt);

  return { ancho, alto };
}

function convertirMedidaMosquitero(texto) {
  const [anchoTxt, altoTxt] = String(texto).split("x");

  return {
    ancho: Number(anchoTxt),
    alto: Number(altoTxt.replace(",", ".")),
  };
}

function crearPayloadBase(ancho, alto) {
  return {
    ancho,
    alto,
    linea: "Herrero",
    color: "blanco",
    tipoVidrio: "3mm",
    mosquitero: false,
    vidrioRepartido: false,
    guia: false,
    cajonBlock: false,
    cortina: null,
    premarco: false,
    contramarco: false,
    bipuntoIzquierda: "ninguno",
    bipuntoDerecha: "ninguno",
    perfil: PERFIL,
  };
}

function ejecutarVentanaHerrero(wrapper, fila, opciones = {}) {
  const { ancho, alto } = convertirMedida(fila.medida);
  const payload = { ...crearPayloadBase(ancho, alto), ...opciones };

  return wrapper(payload);
}

function registrarComparacion(
  resumen,
  modulo,
  fila,
  variante,
  esperado,
  obtenido,
) {
  resumen.medidas++;

  const diferencia = Math.abs(Number(obtenido) - Number(esperado));

  // Tolerancia por redondeos de $1
  if (diferencia <= 1) {
    resumen.ok++;
    return;
  }

  const porcentajeDiferencia =
    Number(esperado) === 0 ? 0 : (diferencia / Number(esperado)) * 100;

  resumen.errores.push({
    modulo,
    medida: fila.medida,
    variante,
    esperado,
    obtenido,
    diferencia,
    porcentajeDiferencia,
  });
}

function clasificarDiferencia(porcentaje) {
  if (porcentaje >= 4.5 && porcentaje <= 5.5) {
    return "Perfil / margen (aprox 5%)";
  }

  if (porcentaje >= 9 && porcentaje <= 11) {
    return "Descuento (aprox 10%)";
  }

  if (porcentaje >= 20 && porcentaje <= 22) {
    return "IVA (aprox 21%)";
  }

  return "Diferencia variable, requiere auditoría manual";
}

function validarVentanasHerrero(modulo, hoja, resumen) {
  for (const fila of hoja.filas) {
    const vidrioEntero = ejecutarVentanaHerrero(modulo.wrapper, fila);
    registrarComparacion(
      resumen,
      modulo.nombre,
      fila,
      "Vidrio entero",
      fila.vidrioEntero,
      vidrioEntero.precioFinal,
    );

    const guia = ejecutarVentanaHerrero(modulo.wrapper, fila, { guia: true });
    registrarComparacion(
      resumen,
      modulo.nombre,
      fila,
      "Ventana con guía",
      fila.ventanaConGuia,
      guia.precioFinal,
    );

    const repartido = ejecutarVentanaHerrero(modulo.wrapper, fila, {
      vidrioRepartido: true,
    });
    registrarComparacion(
      resumen,
      modulo.nombre,
      fila,
      "Vidrio repartido",
      fila.vidrioRepartido,
      repartido.precioFinal,
    );

    const mosquitero = ejecutarVentanaHerrero(modulo.wrapper, fila, {
      mosquitero: true,
    });
    const itemMosquitero = mosquitero.items.find(
      (item) =>
        item.tipo === "mosquitero" ||
        item.nombre?.toLowerCase().includes("mosquitero"),
    );
    const precioMosquitero = aplicarPerfil(
      itemMosquitero?.precio ?? 0,
      PERFIL,
      "mosquiteros",
    );

    registrarComparacion(
      resumen,
      modulo.nombre,
      fila,
      "Mosquitero",
      fila.mosquitero,
      precioMosquitero,
    );
  }
}

function validarVariantes(modulo, hoja, resumen, variantes, crearPayload) {
  for (const fila of hoja.filas) {
    for (const variante of variantes) {
      const resultado = modulo.wrapper(crearPayload(fila, variante.opciones));
      registrarComparacion(
        resumen,
        modulo.nombre,
        fila,
        variante.nombre,
        fila[variante.campo],
        resultado.precioFinal,
      );
    }
  }
}

function crearPayloadVentanaModena(fila, opciones = {}) {
  const { ancho, alto } = convertirMedida(fila.medida);

  return {
    ...crearPayloadBase(ancho, alto),
    linea: "Modena",
    ...opciones,
  };
}

function validarVentanasModena(modulo, hoja, resumen) {
  validarVariantes(
    modulo,
    hoja,
    resumen,
    [
      { nombre: "3mm", campo: "3mm", opciones: { tipoVidrio: "3mm" } },
      { nombre: "4mm", campo: "4mm", opciones: { tipoVidrio: "4mm" } },
      { nombre: "5mm", campo: "5mm", opciones: { tipoVidrio: "5mm" } },
      { nombre: "3+3", campo: "3+3", opciones: { tipoVidrio: "3+3" } },
      {
        nombre: "DVH",
        campo: "dvh",
        opciones: { tipoVidrio: "DVH 4+9+4" },
      },
    ],
    crearPayloadVentanaModena,
  );
}

function crearPayloadRaja(fila, opciones = {}) {
  const { ancho, alto } = convertirMedida(fila.medida);

  return {
    ancho,
    alto,
    color: "blanco",
    perfil: PERFIL,
    modelo: "raja",
    ...opciones,
  };
}

function validarRajasHerrero(modulo, hoja, resumen) {
  validarVariantes(
    modulo,
    hoja,
    resumen,
    [
      { nombre: "3mm", campo: "3mm", opciones: { tipoVidrio: "3mm" } },
      { nombre: "4mm", campo: "4mm", opciones: { tipoVidrio: "4mm" } },
      { nombre: "5mm", campo: "5mm", opciones: { tipoVidrio: "5mm" } },
      {
        nombre: "Esmerilado",
        campo: "esmerilado",
        opciones: { tipoVidrio: "esmerilado" },
      },
      {
        nombre: "Fantasía",
        campo: "fantasia",
        opciones: { tipoVidrio: "fantasia" },
      },
      { nombre: "3+3", campo: "3+3", opciones: { tipoVidrio: "3+3" } },
    ],
    crearPayloadRaja,
  );
}

function validarRajasModena(modulo, hoja, resumen) {
  validarVariantes(
    modulo,
    hoja,
    resumen,
    [
      { nombre: "3mm", campo: "3mm", opciones: { vidrio: "3mm" } },
      { nombre: "4mm", campo: "4mm", opciones: { vidrio: "4mm" } },
      { nombre: "5mm", campo: "5mm", opciones: { vidrio: "5mm" } },
      {
        nombre: "Esmerilado",
        campo: "esmerilado",
        opciones: { vidrio: "esmerilado" },
      },
      {
        nombre: "Fantasía",
        campo: "fantasia",
        opciones: { vidrio: "fantasia" },
      },
      { nombre: "3+3", campo: "3+3", opciones: { vidrio: "3+3" } },
      { nombre: "DVH", campo: "dvh", opciones: { vidrio: "dvh" } },
    ],
    crearPayloadRaja,
  );
}

function validarPostigones(modulo, hoja, resumen) {
  for (const fila of hoja.filas) {
    const { ancho, alto } = convertirMedida(fila.medida);

    for (const variante of [
      { nombre: "Corredizo", campo: "corredizo", tipo: "corredizo" },
      { nombre: "De abrir", campo: "deAbrir", tipo: "abrir" },
    ]) {
      const resultado = modulo.wrapper({
        ancho,
        alto,
        tipo: variante.tipo,
        hojas: fila.hojas,
        marco: variante.tipo === "abrir" ? "ancho" : undefined,
        color: "blanco",
        perfil: PERFIL,
      });

      registrarComparacion(
        resumen,
        modulo.nombre,
        fila,
        variante.nombre,
        fila[variante.campo],
        resultado.precioFinal,
      );
    }
  }
}

function validarPatagonicasModena(modulo, hoja, resumen) {
  const validarFilas = (filas, cantidadRajas) => {
    for (const fila of filas) {
      for (const variante of [
        { nombre: "4mm", campo: "4mm", tipoVidrio: "4mm" },
        { nombre: "3+3", campo: "3+3", tipoVidrio: "3+3" },
        { nombre: "DVH", campo: "dvh", tipoVidrio: "DVH 4+9+4" },
      ]) {
        const resultado = modulo.wrapper({
          medida: fila.medida,
          cantidadRajas,
          tipoVidrio: variante.tipoVidrio,
          perfil: PERFIL,
        });

        registrarComparacion(
          resumen,
          modulo.nombre,
          fila,
          variante.nombre,
          fila[variante.campo],
          resultado.precioFinal,
        );
      }
    }
  };

  validarFilas(hoja.filas, 1);

  for (const seccion of hoja.secciones || []) {
    validarFilas(seccion.filas || [], 2);
  }
}

function ejecutarPuerta(wrapper, payload) {
  // El wrapper y el servicio emiten trazas de depuración. Se silencian sólo
  // durante esta llamada síncrona para preservar la salida del auditor.
  const consoleLogOriginal = console.log;
  console.log = () => {};

  try {
    return wrapper(payload);
  } finally {
    console.log = consoleLogOriginal;
  }
}

function validarPuertas(modulo, hoja, resumen, linea, variantes) {
  for (const fila of hoja.filas) {
    for (const variante of variantes) {
      const esperado = fila[variante.campo];

      if (esperado === "-" || esperado == null) continue;

      const resultado = ejecutarPuerta(modulo.wrapper, {
        ancho: 80,
        alto: 200,
        configuracion: "simple",
        color: "blanco",
        extras: {},
        perfil: PERFIL,
        modelo: fila.modelo,
        tipoVidrio: variante.tipoVidrio,
        linea,
      });

      registrarComparacion(
        resumen,
        modulo.nombre,
        fila,
        variante.nombre,
        esperado,
        resultado.precioFinal,
      );
    }
  }
}

function validarPuertasHerrero(modulo, hoja, resumen) {
  validarPuertas(modulo, hoja, resumen, "herrero", [
    { nombre: "3mm", campo: "3mm", tipoVidrio: "3mm" },
    { nombre: "4mm", campo: "4mm", tipoVidrio: "4mm" },
    { nombre: "5mm", campo: "5mm", tipoVidrio: "5mm" },
    { nombre: "Fantasía", campo: "fantasia", tipoVidrio: "fantasia" },
    { nombre: "Esmerilado", campo: "esmerilado", tipoVidrio: "esmerilado" },
    { nombre: "3+3", campo: "3+3", tipoVidrio: "3+3" },
  ]);
}

function validarPuertasModena(modulo, hoja, resumen) {
  validarPuertas(modulo, hoja, resumen, "modena", [
    { nombre: "3mm", campo: "3mm", tipoVidrio: "3mm" },
    { nombre: "4mm", campo: "4mm", tipoVidrio: "4mm" },
    { nombre: "5mm", campo: "5mm", tipoVidrio: "5mm" },
    { nombre: "Fantasía", campo: "fantasia", tipoVidrio: "fantasia" },
    { nombre: "Esmerilado", campo: "esmerilado", tipoVidrio: "esmerilado" },
    { nombre: "3+3", campo: "3+3", tipoVidrio: "3+3" },
    { nombre: "DVH", campo: "dvh", tipoVidrio: "dvh" },
  ]);
}

function validarPuertasEco(modulo, hoja, resumen) {
  validarPuertas(modulo, hoja, resumen, "eco", [
    { nombre: "3mm", campo: "3mm", tipoVidrio: "3mm" },
    { nombre: "4mm", campo: "4mm", tipoVidrio: "4mm" },
    { nombre: "Fantasía", campo: "fantasia", tipoVidrio: "fantasia" },
  ]);
}

function validarMosquiterosVentana(modulo, hoja, resumen) {
  for (const fila of hoja.filas) {
    const { ancho, alto } = convertirMedidaMosquitero(fila.medida);

    const resultado = modulo.wrapper({
      ancho,
      alto,
      color: "blanco",
      perfil: PERFIL,
    });

    registrarComparacion(
      resumen,
      modulo.nombre,
      fila,
      "Mosquitero",
      fila.precio,
      resultado.precioFinal,
    );
  }
}

function validarPuertasPlaca(modulo, hoja, resumen) {
  const marcos = [
    { nombre: "Marco 10", campo: "marco10", marco: "marco_10" },
    { nombre: "Marco 15", campo: "marco15", marco: "marco_15" },
    { nombre: "Aluminio", campo: "aluminio", marco: "aluminio" },
  ];

  for (const fila of hoja.filas) {
    for (const variante of marcos) {
      if (fila[variante.campo] === "-") continue;

      const resultado = modulo.wrapper({
        tipo: String(fila.tipo).toLowerCase(),
        modelo: String(fila.modelo).toLowerCase().replace(/\s+/g, "_"),
        medida: fila.medida,
        marco: variante.marco,
        perfil: PERFIL,
      });

      registrarComparacion(
        resumen,
        modulo.nombre,
        fila,
        variante.nombre,
        fila[variante.campo],
        resultado.precioFinal,
      );
    }
  }
}

function mostrarErrores(errores) {
  if (!errores.length) return;

  console.log("");
  console.log("=================================");
  console.log("RESUMEN DE DIFERENCIAS");
  console.log("=================================");

  const erroresPorModulo = new Map();

  for (const error of errores) {
    erroresPorModulo.set(
      error.modulo,
      (erroresPorModulo.get(error.modulo) || 0) + 1,
    );
  }

  for (const [modulo, cantidad] of erroresPorModulo) {
    console.log("");
    console.log(`${modulo}:`);
    console.log(`${cantidad} diferencias`);
  }

  console.log("");
  console.log("======================================");
  console.log("ERRORES ENCONTRADOS");
  console.log("======================================");

  for (const error of errores) {
    console.log("");
    console.log(`Módulo:\n${error.modulo}`);
    console.log(`Medida:\n${error.medida}`);
    console.log(`Variante:\n${error.variante}`);
    console.log(`Esperado lista:\n${error.esperado}`);
    console.log(`Obtenido sistema:\n${error.obtenido}`);
    console.log(`Diferencia:\n${error.diferencia}`);
    console.log(
      `Porcentaje diferencia:\n${error.porcentajeDiferencia.toFixed(2)}%`,
    );
    console.log(
      `Diferencia probable:\n${clasificarDiferencia(error.porcentajeDiferencia)}`,
    );
  }
}

function main() {
  const hojas = leerLista();
  const resumen = {
    modulos: 0,
    medidas: 0,
    ok: 0,
    errores: [],
    modulosProcesados: [],
  };

  for (const modulo of MODULOS) {
    const hoja = hojas.find((item) => item.titulo === modulo.titulo);

    if (!hoja || !modulo.validar || !modulo.wrapper) {
      continue;
    }

    if (!Array.isArray(hoja.filas)) {
      throw new Error(`${modulo.nombre}: hoja.filas no existe.`);
    }

    modulo.validar(modulo, hoja, resumen);

    resumen.modulos++;
    resumen.modulosProcesados.push(modulo.nombre);
  }

  console.log("");
  console.log("======================================");
  console.log("VALIDACIÓN FINALIZADA");
  console.log("======================================");

  console.log(`Perfil comercial: ${PERFIL}`);

  console.log("");
  console.log("MÓDULOS AUDITADOS:");
  for (const modulo of resumen.modulosProcesados) {
    console.log(`[OK] ${modulo}`);
  }

  console.log("");
  console.log("--------------------------------------");
  console.log(`Total módulos: ${resumen.modulos}`);
  console.log(`Casos comparados: ${resumen.medidas}`);
  console.log(`Coincidencias: ${resumen.ok}`);
  console.log(`Diferencias: ${resumen.errores.length}`);
  console.log("--------------------------------------");

  mostrarErrores(resumen.errores);

  console.log("");
  console.log("======================================");

  if (resumen.errores.length === 0) {
    console.log("[OK] TODAS LAS LISTAS COINCIDEN CON EL SISTEMA");
  } else {
    console.log("❌ HAY DIFERENCIAS PARA REVISAR");
  }
}

try {
  main();
} catch (error) {
  console.log("");
  console.log("======================================");
  console.log("ERROR");
  console.log("======================================");
  console.error(error);
  process.exitCode = 1;
}
