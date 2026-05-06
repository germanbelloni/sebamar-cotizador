const fs = require("fs");
const calcular = require("../wrappers/mosquiteros/calcularMosquiteroVentana");

const casos = [
  { ancho: 100, alto: 100 },
  { ancho: 120, alto: 120, color: "negro" },
];

const res = casos.map((c) => ({
  input: c,
  output: calcular(c),
}));

fs.writeFileSync("mosquiteros.json", JSON.stringify(res, null, 2));

console.log("✅ generado");
