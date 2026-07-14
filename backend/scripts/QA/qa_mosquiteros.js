const fs = require("fs");
const path = require("path");

const { fromRoot } = require("../../utils/path");

const calcularMosquiteroVentana = require(
  fromRoot("wrappers/mosquiteros/calcularMosquiteroVentana"),
);

const calcularMosquiteroFijo = require(
  fromRoot("wrappers/mosquiteros/calcularMosquiteroFijo"),
);

const calcularPuertaMosquitera = require(
  fromRoot("wrappers/mosquiteros/calcularPuertaMosquitera"),
);

const casos = [
  // =========================
  // VENTANA
  // =========================
  {
    nombre: "Ventana Blanco",
    tipo: "ventana",
    payload: {
      ancho: 120,
      alto: 110,
      color: "blanco",
      perfil: "papu",
    },
  },
  {
    nombre: "Ventana Negro",
    tipo: "ventana",
    payload: {
      ancho: 120,
      alto: 110,
      color: "negro",
      perfil: "papu",
    },
  },

  // =========================
  // FIJO
  // =========================
  {
    nombre: "Fijo Blanco",
    tipo: "fijo",
    payload: {
      ancho: 100,
      alto: 100,
      color: "blanco",
      perfil: "papu",
    },
  },
  {
    nombre: "Fijo Negro",
    tipo: "fijo",
    payload: {
      ancho: 100,
      alto: 100,
      color: "negro",
      perfil: "papu",
    },
  },
  {
    nombre: "Fijo Simil Madera",
    tipo: "fijo",
    payload: {
      ancho: 100,
      alto: 100,
      color: "simil_madera",
      perfil: "papu",
    },
  },
  {
    nombre: "Fijo Bronce Colonial",
    tipo: "fijo",
    payload: {
      ancho: 100,
      alto: 100,
      color: "bronce_colonial",
      perfil: "papu",
    },
  },

  // =========================
  // PUERTA MOSQUITERA
  // =========================
  {
    nombre: "Puerta Mosquitera Blanco",
    tipo: "puerta",
    payload: {
      ancho: 80,
      alto: 200,
      color: "blanco",
      ladoBisagra: "derecha",
      perfil: "papu",
    },
  },
];

const resultados = [];

for (const test of casos) {
  try {
    let res;

    switch (test.tipo) {
      case "ventana":
        res = calcularMosquiteroVentana(test.payload);
        break;

      case "fijo":
        res = calcularMosquiteroFijo(test.payload);
        break;

      case "puerta":
        res = calcularPuertaMosquitera(test.payload);
        break;

      default:
        throw new Error(`Tipo inválido: ${test.tipo}`);
    }

    resultados.push({
      caso: test.nombre,
      descripcion: res.descripcion,
      costoBase: res.costoBase,
      precioFinal: res.precioFinal,
      items: res.items.length,
      valido: true,
      error: "",
    });

    console.log(`✅ ${test.nombre}`);
  } catch (err) {
    resultados.push({
      caso: test.nombre,
      descripcion: "",
      costoBase: "",
      precioFinal: "",
      items: "",
      valido: false,
      error: err.message,
    });

    console.log(`❌ ${test.nombre}`);
    console.log(err.message);
  }
}

const csv = [
  "Caso,Descripcion,CostoBase,PrecioFinal,Items,Valido,Error",
  ...resultados.map(
    (r) =>
      `"${r.caso}","${r.descripcion}","${r.costoBase}","${r.precioFinal}","${r.items}","${r.valido}","${r.error}"`,
  ),
].join("\n");

// crear carpeta output si no existe
const outputDir = path.join(__dirname, "output");
fs.mkdirSync(outputDir, { recursive: true });

// guardar csv
const destino = path.join(outputDir, "qa_mosquiteros.csv");
fs.writeFileSync(destino, csv);

console.log("");
console.log("=================================");
console.log("QA MOSQUITEROS FINALIZADO");
console.log(`Archivo: ${destino}`);
console.log("=================================");
