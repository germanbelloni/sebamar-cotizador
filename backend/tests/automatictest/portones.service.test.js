const calcularPortones = require("../../services/portones/calcularPortones");

console.log("\n🧪 TEST PORTONES\n");

const r = calcularPortones({
  ancho: 240,
  alto: 200,
  hojas: 3,
  linea: "modena",
  modelo: "modelo 3",
  color: "negro",
  tipoVidrio: "3mm",
});

console.log(r);
