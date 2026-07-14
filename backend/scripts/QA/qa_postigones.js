const fs = require("fs");
const path = require("path");
const { fromRoot } = require("../../utils/path");

const calcularPostigon = require(
  fromRoot("wrappers/postigones/calcularPostigones"),
);

fs.mkdirSync(path.join(__dirname, "output"), { recursive: true });

const colores = ["blanco", "negro", "bronce colonial", "simil madera"];

const tipos = ["abrir", "corredizo"];

const casos = [];

for (const tipo of tipos) {
  for (const color of colores) {
    casos.push({
      nombre: `${tipo} - ${color}`,
      payload: {
        ancho: 150,
        alto: 150,
        tipo,
        hojas: 2,
        apertura: "derecha",
        color,
        marco: "ancho",
        perfil: "papu",
        extras: {
          microperforado: false,
          herrajeBlanco: false,
        },
      },
    });
  }
}

const resultados = [];

for (const test of casos) {
  try {
    const res = calcularPostigon(test.payload);

    resultados.push({
      caso: test.nombre,
      descripcion: res.descripcion,
      costoBase: res.costoBase,
      precioFinal: res.precioFinal,
      items: res.items.length,
      valido: true,
    });

    console.log(`✅ ${test.nombre}`);
  } catch (err) {
    resultados.push({
      caso: test.nombre,
      error: err.message,
      valido: false,
    });

    console.log(`❌ ${test.nombre}`);
    console.log(err.message);
  }
}

const csv = [
  "Caso,Descripcion,CostoBase,PrecioFinal,Items,Valido",
  ...resultados.map(
    (r) =>
      `"${r.caso}","${r.descripcion || ""}",${r.costoBase || ""},${r.precioFinal || ""},${r.items || ""},${r.valido}`,
  ),
].join("\n");

const destino = path.join(__dirname, "output", "qa_postigones.csv");

fs.writeFileSync(destino, csv);

console.log("");
console.log("=================================");
console.log("QA POSTIGONES FINALIZADO");
console.log("Archivo:", destino);
console.log("=================================");
