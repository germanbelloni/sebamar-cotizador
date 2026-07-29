"use strict";

const fs = require("fs");
const path = require("path");

const calcularVentanaHerrero = require("../wrappers/ventanas/calcularVentanaHerrero");
const { aplicarPerfil } = require("./motor/aplicarPerfil");

// ======================================
// CONFIGURACIÓN
// ======================================

const PERFIL = "azul";

const MODULOS = [
  {
    nombre: "Ventanas Herrero",
    archivo: `Lista ${PERFIL} - Ventanas Herrero.json`,
    wrapper: calcularVentanaHerrero,
    tipo: "ventanas_herrero",
  },
];

// ======================================

function leerJson(nombreArchivo) {
  const ruta = path.join(__dirname, "output", nombreArchivo);

  if (!fs.existsSync(ruta)) {
    throw new Error(`No existe el archivo:\n${ruta}`);
  }

  return JSON.parse(fs.readFileSync(ruta, "utf8"));
}

function convertirMedida(texto) {
  const [anchoTxt, altoTxt] = String(texto).split("x");

  const ancho = Number(anchoTxt);

  let alto;

  if (altoTxt.includes(",")) {
    alto = Math.round(Number(altoTxt.replace(",", ".")) * 100);
  } else {
    alto = Number(altoTxt);
  }

  return {
    ancho,
    alto,
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

console.log("======================================");
console.log("VALIDADOR DE LISTAS");
console.log("======================================");

// ======================================
// UTILIDADES
// ======================================

function obtenerLookup(resultado) {
  if (!resultado.audit) return null;

  return resultado.audit.find((paso) => paso.etapa === "Lookup") ?? null;
}

function ejecutarVentanaHerrero(wrapper, fila, opciones = {}) {
  const { ancho, alto } = convertirMedida(fila.medida);

  const payload = {
    ...crearPayloadBase(ancho, alto),
    ...opciones,
  };

  return {
    fila,
    payload,
    resultado: wrapper(payload),
  };
}

function comparar(nombre, esperado, obtenido) {
  if (esperado === obtenido) {
    console.log(`   ✓ ${nombre.padEnd(20)} OK (${esperado})`);
    return true;
  }

  console.log(
    `   ✗ ${nombre.padEnd(20)} JSON:${esperado}  Wrapper:${obtenido}`,
  );

  return false;
}

function validarModulo(modulo) {
  console.log("");
  console.log("======================================");
  console.log(modulo.nombre);
  console.log("======================================");

  const lista = leerJson(modulo.archivo);

  if (!lista.hoja || !Array.isArray(lista.hoja.filas)) {
    throw new Error(`${modulo.nombre}: hoja.filas no existe.`);
  }

  let total = 0;

  for (const fila of lista.hoja.filas) {
    console.log("");
    console.log(`================ ${fila.medida} ================`);

    // ----------------------------------------
    // Vidrio entero
    // ----------------------------------------

    const vidrioEntero = ejecutarVentanaHerrero(modulo.wrapper, fila);

    comparar(
      "Vidrio entero",
      fila.vidrioEntero,
      vidrioEntero.resultado.precioFinal,
    );

    // ----------------------------------------
    // Guía
    // ----------------------------------------

    const guia = ejecutarVentanaHerrero(modulo.wrapper, fila, {
      guia: true,
    });

    comparar("Ventana guía", fila.ventanaConGuia, guia.resultado.precioFinal);

    // ----------------------------------------
    // Vidrio repartido
    // ----------------------------------------

    const repartido = ejecutarVentanaHerrero(modulo.wrapper, fila, {
      vidrioRepartido: true,
    });

    comparar(
      "Vidrio repartido",
      fila.vidrioRepartido,
      repartido.resultado.precioFinal,
    );

    // ----------------------------------------
    // Mosquitero
    // ----------------------------------------

    const mosquitero = ejecutarVentanaHerrero(modulo.wrapper, fila, {
      mosquitero: true,
    });

    const itemMosquitero =
      mosquitero.resultado.items.find(
        (i) =>
          i.tipo === "mosquitero" ||
          i.nombre?.toLowerCase().includes("mosquitero"),
      ) ?? null;

    // La lista pública se genera aplicando aplicarPerfil()
    // directamente sobre el valor del catálogo del mosquitero.
    // El wrapper sólo expone el costo del item, por eso para
    // este caso especial usamos el mismo cálculo que el generador.

    const precioMosquitero = aplicarPerfil(
      itemMosquitero?.precio ?? 0,
      PERFIL,
      "mosquiteros",
    );

    comparar("Mosquitero", fila.mosquitero, precioMosquitero);

    total++;
  }

  console.log("");
  console.log(`Total medidas: ${total}`);
}
// ======================================
// MAIN
// ======================================

function main() {
  console.log("");

  let modulos = 0;

  for (const modulo of MODULOS) {
    validarModulo(modulo);
    modulos++;
  }

  console.log("");
  console.log("======================================");
  console.log("VALIDACIÓN FINALIZADA");
  console.log("======================================");
  console.log(`Módulos procesados : ${modulos}`);
  console.log("======================================");
}

try {
  main();
} catch (error) {
  console.log("");
  console.log("======================================");
  console.log("ERROR");
  console.log("======================================");
  console.error(error);
  process.exit(1);
}
