const fs = require("fs");
const path = require("path");

const { fromRoot } = require("../../utils/path");

const calcularVentanaAbrir = require(
  fromRoot("wrappers/ventanasAbrir/calcularVentanaAbrir"),
);

fs.mkdirSync(path.join(__dirname, "output"), { recursive: true });

const colores = ["blanco", "negro", "bronce colonial", "simil madera"];

const casos = [];

for (const color of colores) {
  casos.push({
    nombre: `Ventana Abrir Herrero ${color}`,
    payload: {
      ancho: 150,
      alto: 120,

      linea: "Herrero",

      color,

      tipoVidrio: "4mm",

      mosquitero: false,
      bisagra: "izquierda",

      premarco: false,
      contramarco: false,

      herrajesBlancos: false,

      perfil: "papu",
    },
  });
}

const resultados = [];

for (const test of casos) {
  try {
    const res = calcularVentanaAbrir(test.payload);

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

const destino = path.join(__dirname, "output", "qa_ventana_abrir.csv");

fs.writeFileSync(destino, csv);

console.log("");
console.log("=================================");
console.log("QA VENTANA ABRIR FINALIZADO");
console.log("Archivo:", destino);
console.log("=================================");
