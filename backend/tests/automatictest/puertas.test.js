const { fromRoot } = require("../../utils/path");

const calcularPuerta = require(fromRoot("wrappers/puertas/calcularPuerta"));

console.log(
  calcularPuerta({
    linea: "modena",
    modelo: "modelo 3",
    medida: "80x200",
    color: "negro",
    tipoVidrio: "3mm",
    perfil: "azul",
  }),
);
