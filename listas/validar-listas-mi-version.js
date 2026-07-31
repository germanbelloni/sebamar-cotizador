"use strict";

/*
 * Auditor de listas: compara el valor publicado (JSON generado desde Excel)
 * contra el precio final de los wrappers que usa el cotizador.
 */
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
const calcularPuertaEco = require("../wrappers/puertas/calcularPuertaEco");
const calcularMosquiteroVentana = require("../wrappers/mosquiteros/calcularMosquiteroVentana");
const { aplicarPerfil } = require("./motor/aplicarPerfil");
const perfiles = require("../backend/config/perfiles");

const perfilesValidos = ["azul", "amarilla", "verde", "papu"];
const perfil = String(process.argv[2] || "azul").toLowerCase();

if (!perfilesValidos.includes(perfil)) {
  throw new Error(`Perfil inválido: ${perfil}. Use: ${perfilesValidos.join(", ")}.`);
}

const resumen = { modulos: 0, casos: 0, ok: 0, errores: 0 };
const diferencias = [];

function leerLista() {
  const nombre = `Lista ${perfil[0].toUpperCase()}${perfil.slice(1)}.json`;
  const ruta = path.join(__dirname, "output", nombre);
  if (!fs.existsSync(ruta)) throw new Error(`No existe el archivo: ${ruta}`);
  return JSON.parse(fs.readFileSync(ruta, "utf8"));
}

function medida(texto) {
  const [anchoTexto, altoTexto] = String(texto).trim().split("x");
  const ancho = Number(anchoTexto);
  const alto = Number(altoTexto.replace(",", "."));
  if (!Number.isFinite(ancho) || !Number.isFinite(alto)) {
    throw new Error(`Medida inválida: ${texto}`);
  }
  return { ancho, alto: alto < 10 ? alto * 100 : alto };
}

function precio(resultado) {
  return Math.round(Number(resultado?.precioFinal));
}

function clasificarDiferencia(porcentaje) {
  if (porcentaje >= 4.5 && porcentaje <= 5.5) return "Perfil / margen (aprox 5%)";
  if (porcentaje >= 9 && porcentaje <= 11) return "Descuento (aprox 10%)";
  if (porcentaje >= 20 && porcentaje <= 22) return "IVA (aprox 21%)";
  return "Diferencia variable, requiere auditoría manual";
}

function comparar(modulo, fila, variante, esperado, resultado) {
  if (esperado === "-" || esperado == null) return;
  const obtenido = precio(resultado);
  resumen.casos++;
  if (Number(esperado) === obtenido) {
    resumen.ok++;
    return;
  }
  resumen.errores++;
  const diferencia = Math.abs(obtenido - Number(esperado));
  const porcentaje = Number(esperado) === 0 ? 0 : (diferencia / Number(esperado)) * 100;
  diferencias.push({
    modulo, medida: fila.medida || fila.modelo || "-", variante,
    esperado: Number(esperado), obtenido, diferencia, porcentaje,
  });
}

function imprimirReporteDiferencias() {
  console.log("\n=================================");
  console.log("RESUMEN DE DIFERENCIAS");
  console.log("=================================");
  const porModulo = new Map();
  for (const diferencia of diferencias) {
    porModulo.set(diferencia.modulo, (porModulo.get(diferencia.modulo) || 0) + 1);
  }
  for (const [modulo, cantidad] of porModulo) {
    console.log(`\n${modulo}:`);
    console.log(`${cantidad} diferencias`);
  }
  for (const diferencia of diferencias) {
    console.log(`\nMódulo: ${diferencia.modulo}`);
    console.log(`Medida: ${diferencia.medida}`);
    console.log(`Variante: ${diferencia.variante}`);
    console.log(`Esperado lista: ${diferencia.esperado}`);
    console.log(`Obtenido sistema: ${diferencia.obtenido}`);
    console.log(`Diferencia: ${diferencia.diferencia}`);
    console.log(`Porcentaje diferencia: ${diferencia.porcentaje.toFixed(2)}%`);
    console.log(`Diferencia probable: ${clasificarDiferencia(diferencia.porcentaje)}`);
  }
}

function registrarModulo(nombre, fn) {
  resumen.modulos++;
  fn();
}

function baseVentana(ancho, alto, linea) {
  return {
    ancho, alto, linea, color: "blanco", tipoVidrio: "3mm", perfil,
    mosquitero: false, vidrioRepartido: false, guia: false,
    cajonBlock: false, cortina: null, premarco: false, contramarco: false,
    bipuntoIzquierda: "ninguno", bipuntoDerecha: "ninguno",
  };
}

function validarVentanasHerrero(hoja) {
  registrarModulo(hoja.nombre, () => hoja.filas.forEach((fila) => {
    const { ancho, alto } = medida(fila.medida);
    const ejecutar = (opciones = {}) => calcularVentanaHerrero({ ...baseVentana(ancho, alto, "herrero"), ...opciones });
    comparar(hoja.nombre, fila, "Vidrio entero", fila.vidrioEntero, ejecutar());
    comparar(hoja.nombre, fila, "Guía", fila.ventanaConGuia, ejecutar({ guia: true }));
    comparar(hoja.nombre, fila, "Vidrio repartido", fila.vidrioRepartido, ejecutar({ vidrioRepartido: true }));
    // En la lista el mosquitero es un producto independiente, no el total de ventana.
    const r = ejecutar({ mosquitero: true });
    const item = r.items.find((i) => i.tipo === "mosquitero");
    comparar(hoja.nombre, fila, "Mosquitero", fila.mosquitero, {
      precioFinal: aplicarPerfil(item?.precio || 0, perfil, "mosquiteros"),
    });
  }));
}

function validarVentanasModena(hoja) {
  registrarModulo(hoja.nombre, () => hoja.filas.forEach((fila) => {
    const { ancho, alto } = medida(fila.medida);
    const ejecutar = (opciones = {}) => calcularVentanaModena({ ...baseVentana(ancho, alto, "modena"), ...opciones });
    for (const tipoVidrio of ["3mm", "4mm", "5mm", "3+3"]) {
      comparar(hoja.nombre, fila, tipoVidrio, fila[tipoVidrio], ejecutar({ tipoVidrio }));
    }
    comparar(hoja.nombre, fila, "DVH", fila.dvh, ejecutar({ tipoVidrio: "DVH 4+9+4" }));
    const guia = ejecutar({ guia: true });
    const itemGuia = guia.items.find((i) => i.tipo === "guia");
    comparar(hoja.nombre, fila, "Guía", fila.guia, { precioFinal: aplicarPerfil(itemGuia?.precio || 0, perfil, "modena") });
    const mosca = ejecutar({ mosquitero: true });
    const itemMosca = mosca.items.find((i) => i.tipo === "mosquitero");
    const perfilMosquitero = { ...perfiles[perfil].mosquiteros, descuento: perfiles[perfil].modena.descuento };
    comparar(hoja.nombre, fila, "Mosquitero", fila.mosquitero, { precioFinal: aplicarPerfil(itemMosca?.precio || 0, perfilMosquitero) });
  }));
}

function validarRajas(hoja, wrapper, linea) {
  registrarModulo(hoja.nombre, () => hoja.filas.forEach((fila) => {
    const { ancho, alto } = medida(fila.medida);
    for (const tipoVidrio of hoja.campos.filter((campo) => campo !== "medida")) {
      comparar(hoja.nombre, fila, tipoVidrio, fila[tipoVidrio], wrapper({ ancho, alto, linea, color: "blanco", vidrio: tipoVidrio, perfil }));
    }
  }));
}

function validarPatagonicasModena(hoja) {
  registrarModulo(hoja.nombre, () => hoja.filas.forEach((fila) => {
    const { ancho, alto } = medida(fila.medida);
    for (const tipoVidrio of ["4mm", "dvh", "3+3"]) {
      comparar(hoja.nombre, fila, tipoVidrio, fila[tipoVidrio], calcularPatagonicaModena({ ancho, alto, cantidadRajas: 1, tipoVidrio, color: "blanco", perfil }));
    }
  }));
}

function validarPostigones(hoja) {
  registrarModulo(hoja.nombre, () => hoja.filas.forEach((fila) => {
    const { ancho, alto } = medida(fila.medida);
    comparar(hoja.nombre, fila, "Corredizo", fila.corredizo, calcularPostigones({ ancho, alto, hojas: fila.hojas, tipo: "corredizo", color: "blanco", perfil }));
    comparar(hoja.nombre, fila, "De abrir", fila.deAbrir, calcularPostigones({ ancho, alto, hojas: fila.hojas, tipo: "abrir", color: "blanco", perfil }));
  }));
}

function modeloInterno(modelo) {
  return String(modelo).toLowerCase().replace(/\s+/g, " ").trim();
}

function validarPuertas(hoja, linea, wrapper = calcularPuerta) {
  registrarModulo(hoja.nombre, () => hoja.filas.forEach((fila) => {
    for (const tipoVidrio of hoja.campos.filter((campo) => campo !== "modelo")) {
      comparar(hoja.nombre, fila, tipoVidrio, fila[tipoVidrio], wrapper({
        ancho: 80, alto: 200, linea, configuracion: "simple",
        modelo: modeloInterno(fila.modelo), tipoVidrio, color: "blanco", perfil, extras: {},
      }));
    }
  }));
}

function validarMosquiterosVentana(hoja) {
  registrarModulo(hoja.nombre, () => hoja.filas.forEach((fila) => {
    const { ancho, alto } = medida(fila.medida);
    comparar(hoja.nombre, fila, "Mosquitero", fila.precio, calcularMosquiteroVentana({ ancho, alto, color: "blanco", perfil }));
  }));
}

function validarPuertasPlaca(hoja) {
  registrarModulo(hoja.nombre, () => hoja.filas.forEach((fila) => {
    const { ancho, alto } = medida(fila.medida);
    for (const [campo, marco] of [["marco10", "marco_10"], ["marco15", "marco_15"], ["aluminio", "aluminio"]]) {
      if (fila[campo] === "-" || fila[campo] == null) continue;
      comparar(hoja.nombre, fila, campo, fila[campo], calcularPuertaPlaca({ ancho, alto, tipo: fila.tipo.toLowerCase(), modelo: fila.modelo.toLowerCase().replace(/\s+/g, "_"), marco, mano: "derecha", perfil }));
    }
  }));
}

function noSoportado(nombre, motivo) {
  console.log(`\nMódulo no soportado: ${nombre}`);
  console.log(`Motivo real: ${motivo}`);
}

function main() {
  const hojas = leerLista();
  const porNombre = new Map(hojas.map((hoja) => [hoja.nombre, hoja]));
  const ejecutar = (nombre, fn) => {
    const hoja = porNombre.get(nombre);
    if (!hoja) return noSoportado(nombre, "No existe una hoja correspondiente en el JSON de la lista.");
    fn(hoja);
  };

  ejecutar("Ventanas Herrero", validarVentanasHerrero);
  ejecutar("Ventanas Modena", validarVentanasModena);
  ejecutar("Rajas Herrero", (h) => validarRajas(h, calcularRajaHerrero, "herrero"));
  ejecutar("Rajas Modena", (h) => validarRajas(h, calcularRajaModena, "modena"));
  ejecutar("Postigones", validarPostigones);
  ejecutar("Patagonicas Modena", validarPatagonicasModena);
  ejecutar("Puertas Placa", validarPuertasPlaca);
  ejecutar("Puertas Herrero", (h) => validarPuertas(h, "herrero"));
  ejecutar("Puertas Modena", (h) => validarPuertas(h, "modena"));
  ejecutar("Puertas Livianas", (h) => validarPuertas(h, "eco", calcularPuertaEco));
  ejecutar("Mosquiteros ventana", validarMosquiterosVentana);

  noSoportado("Media Puerta Herrero", "La hoja publica sólo la media hoja; el wrapper requiere también la puerta principal y ese dato no está en la fila.");
  noSoportado("Puertas Mosquitera", "No existe una hoja comercial específica en el JSON de la lista.");
  noSoportado("Portones", "No existe una hoja comercial específica en el JSON de la lista.");
  noSoportado("Cortinas", "No existe una hoja comercial específica en el JSON de la lista.");
  noSoportado("Paño Fijo", "No existe una hoja comercial específica en el JSON de la lista.");
  noSoportado("Marcos", "No existe una hoja comercial específica en el JSON de la lista.");

  imprimirReporteDiferencias();

  console.log("\n======================================");
  console.log(`Perfil: ${perfil}`);
  console.log(`Módulos procesados: ${resumen.modulos}`);
  console.log(`Casos procesados: ${resumen.casos}`);
  console.log(`OK: ${resumen.ok}`);
  console.log(`ERRORES: ${resumen.errores}`);
}

try { main(); } catch (error) { console.error("\nERROR", error); process.exitCode = 1; }
