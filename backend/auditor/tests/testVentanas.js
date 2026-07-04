const { fromRoot } = require("../../utils/path");

const calcularVentanaHerrero = require(
  fromRoot("wrappers/ventanas/calcularVentanaHerrero"),
);

const calcularVentanaModena = require(
  fromRoot("wrappers/ventanas/calcularVentanaModena"),
);

const compararCotizacion = require("../compararCotizacion");
const ReportPrinter = require("../ReportPrinter");

// ========================================
// HERRERO
// ========================================

const esperadoHerrero = {
  costoBase: 0,
  precioProveedor: 0,
  precioLista: 0,
  precioFinal: 0,
};

const resultadoHerrero = calcularVentanaHerrero({
  ancho: 120,
  alto: 100,
  color: "blanco",
  perfil: "amarilla",
});

const auditorHerrero = compararCotizacion({
  esperado: esperadoHerrero,
  obtenido: resultadoHerrero,
});

console.log("");
console.log("============== VENTANA HERRERO ==============");

ReportPrinter.print(auditorHerrero);

// ========================================
// MODENA
// ========================================

const esperadoModena = {
  costoBase: 0,
  precioProveedor: 0,
  precioLista: 0,
  precioFinal: 0,
};

const resultadoModena = calcularVentanaModena({
  ancho: 120,
  alto: 100,
  color: "blanco",
  tipoVidrio: "4mm",
  perfil: "amarilla",
});

const auditorModena = compararCotizacion({
  esperado: esperadoModena,
  obtenido: resultadoModena,
});

console.log("");
console.log("============== VENTANA MODENA ==============");

ReportPrinter.print(auditorModena);
