const fs = require("fs");
const path = require("path");

const { fromRoot } = require("../../utils/path");

const calcularPuertaPlaca = require(
  fromRoot("wrappers/placas/calcularPuertaPlaca"),
);

fs.mkdirSync(path.join(__dirname, "output"), { recursive: true });

const casos = [
  {
    nombre: "Placa Finger Pino 80x200",
    payload: {
      ancho: 80,
      alto: 200,
      tipo: "placa",
      modelo: "finger_pino",
      marco: "marco_10",
      mano: "derecha",
      perfil: "papu",
    },
  },

  {
    nombre: "Placa Finger Cedro Legacy",
    payload: {
      ancho: 80,
      alto: 200,
      tipo: "placa",
      modelo: "finger_cedro",
      marco: "marco_10",
      mano: "derecha",
      perfil: "papu",
    },
  },

  {
    nombre: "Embutir Finger Pino 60x200",
    payload: {
      ancho: 60,
      alto: 200,
      tipo: "embutir",
      modelo: "finger_pino",
      marco: "marco_15",
      mano: "derecha",
      perfil: "papu",
    },
  },

  {
    nombre: "Placa 90x200",
    payload: {
      ancho: 90,
      alto: 200,
      tipo: "placa",
      modelo: "finger_pino",
      marco: "marco_10",
      mano: "derecha",
      perfil: "papu",
    },
  },

  {
    nombre: "Placa 100x200",
    payload: {
      ancho: 100,
      alto: 200,
      tipo: "placa",
      modelo: "finger_pino",
      marco: "marco_10",
      mano: "derecha",
      perfil: "papu",
    },
  },

  {
    nombre: "Placa 80x205",
    payload: {
      ancho: 80,
      alto: 205,
      tipo: "placa",
      modelo: "finger_pino",
      marco: "marco_10",
      mano: "derecha",
      perfil: "papu",
    },
  },

  {
    nombre: "Placa 80x210",
    payload: {
      ancho: 80,
      alto: 210,
      tipo: "placa",
      modelo: "finger_pino",
      marco: "marco_10",
      mano: "derecha",
      perfil: "papu",
    },
  },

  // ERRORES

  {
    nombre: "ERROR Ancho 110",
    payload: {
      ancho: 110,
      alto: 200,
      tipo: "placa",
      modelo: "finger_pino",
      marco: "marco_10",
      mano: "derecha",
      perfil: "papu",
    },
  },

  {
    nombre: "ERROR Alto 220",
    payload: {
      ancho: 80,
      alto: 220,
      tipo: "placa",
      modelo: "finger_pino",
      marco: "marco_10",
      mano: "derecha",
      perfil: "papu",
    },
  },
];

const resultados = [];

for (const test of casos) {
  try {
    const res = calcularPuertaPlaca(test.payload);

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

const destino = path.join(__dirname, "output", "qa_placas.csv");

fs.writeFileSync(destino, csv);

console.log("");
console.log("=================================");
console.log("QA PLACAS FINALIZADO");
console.log("Archivo:", destino);
console.log("=================================");
