const fs = require("fs");
const path = require("path");

const { fromRoot } = require("../../utils/path");

const calcularPorton = require(fromRoot("wrappers/portones/calcularPorton"));

fs.mkdirSync(path.join(__dirname, "output"), { recursive: true });

const colores = ["blanco", "negro", "bronce colonial", "simil madera"];

const casos = [];

// =====================================
// PORTÓN ABRIR 240x200 MODELO 4
// Herrero + Modena
// Blanco, Negro, Bronce, Simil
// =====================================

for (const linea of ["herrero", "modena"]) {
  for (const color of colores) {
    casos.push({
      nombre: `Abrir Modelo4 ${linea} ${color}`,
      payload: {
        ancho: 240,
        alto: 200,

        linea,
        configuracion: "porton",
        tipoPorton: "abrir",

        modelo: "modelo 4",

        hojas: 3,
        color,

        mano: "derecha",

        tipoVidrio: "3mm",

        premarco: false,
        contramarco: false,

        extras: {
          barralRecto: 0,
          barralCurvo: 0,
          mediaManija: false,
          picaporte: false,
        },

        perfil: "papu",
      },
    });
  }
}

// =====================================
// PORTÓN PLEGADIZO 270x205 MODELO 5
// Herrero + Modena
// Blanco, Negro, Bronce, Simil
// Con barral recto
// =====================================

for (const linea of ["herrero", "modena"]) {
  for (const color of colores) {
    casos.push({
      nombre: `Plegadizo Modelo5 ${linea} ${color}`,
      payload: {
        ancho: 270,
        alto: 205,

        linea,
        configuracion: "porton",
        tipoPorton: "plegadizo",

        modelo: "modelo 5",

        hojas: 3,
        color,

        mano: "derecha",

        tipoVidrio: "3mm",

        premarco: false,
        contramarco: false,

        extras: {
          barralRecto: 1,
          barralCurvo: 0,
          mediaManija: false,
          picaporte: false,
        },

        perfil: "papu",
      },
    });
  }
}

// =====================================
// EXTRA MODENA CON PREMARCO
// =====================================

casos.push({
  nombre: "Modena Premarco Contramarco",
  payload: {
    ancho: 270,
    alto: 205,

    linea: "modena",
    configuracion: "porton",
    tipoPorton: "plegadizo",

    modelo: "modelo 5",

    hojas: 3,
    color: "blanco",

    mano: "derecha",

    tipoVidrio: "3mm",

    premarco: true,
    contramarco: true,

    extras: {
      barralRecto: 1,
      barralCurvo: 0,
      mediaManija: false,
      picaporte: false,
    },

    perfil: "papu",
  },
});

const resultados = [];

for (const test of casos) {
  try {
    const res = calcularPorton(test.payload);

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

const destino = path.join(__dirname, "output", "qa_portones.csv");

fs.writeFileSync(destino, csv);

console.log("");
console.log("=================================");
console.log("QA PORTONES FINALIZADO");
console.log("Archivo:", destino);
console.log("=================================");
