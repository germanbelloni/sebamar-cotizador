const { fromRoot } = require("../../utils/path");

const calcularPuertas = require(fromRoot("services/puertas/calcularPuertas"));

console.log(
  calcularPuertas({
    linea: "modena",
    modelo: "modelo 3",
    medida: "80x200",
    color: "negro",
    tipoVidrio: "3mm",
  }),
);
