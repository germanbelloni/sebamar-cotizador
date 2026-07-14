const fs = require("fs");
const path = require("path");

const { fromRoot } = require("../../utils/path");

const calcularSuperficie = require(
  fromRoot("wrappers/superficies/calcularSuperficies"),
);

fs.mkdirSync(path.join(__dirname, "output"), { recursive: true });

const casos = [
  // ====================
  // PAÑO FIJO 150x150
  // ====================

  {
    nombre: "Pano Fijo Blanco",
    payload: {
      tipo: "pano_fijo",
      ancho: 150,
      alto: 150,
      linea: "herrero",
      color: "blanco",
      tipoVidrio: "4mm",
      perfil: "papu",
    },
  },

  {
    nombre: "Pano Fijo Negro",
    payload: {
      tipo: "pano_fijo",
      ancho: 150,
      alto: 150,
      linea: "herrero",
      color: "negro",
      tipoVidrio: "4mm",
      perfil: "papu",
    },
  },

  {
    nombre: "Pano Fijo Bronce",
    payload: {
      tipo: "pano_fijo",
      ancho: 150,
      alto: 150,
      linea: "herrero",
      color: "bronce colonial",
      tipoVidrio: "4mm",
      perfil: "papu",
    },
  },

  {
    nombre: "Pano Fijo Simil",
    payload: {
      tipo: "pano_fijo",
      ancho: 150,
      alto: 150,
      linea: "herrero",
      color: "simil madera",
      tipoVidrio: "4mm",
      perfil: "papu",
    },
  },

  // ====================
  // PREMARCO
  // ====================

  {
    nombre: "Premarco",
    payload: {
      tipo: "premarco",
      ancho: 150,
      alto: 150,
      perfil: "papu",
    },
  },

  // ====================
  // CONTRAMARCO
  // ====================

  {
    nombre: "Contramarco Blanco",
    payload: {
      tipo: "contramarco",
      ancho: 150,
      alto: 150,
      color: "blanco",
      perfil: "papu",
    },
  },

  {
    nombre: "Contramarco Negro",
    payload: {
      tipo: "contramarco",
      ancho: 150,
      alto: 150,
      color: "negro",
      perfil: "papu",
    },
  },

  {
    nombre: "Contramarco Bronce",
    payload: {
      tipo: "contramarco",
      ancho: 150,
      alto: 150,
      color: "bronce colonial",
      perfil: "papu",
    },
  },

  {
    nombre: "Contramarco Simil",
    payload: {
      tipo: "contramarco",
      ancho: 150,
      alto: 150,
      color: "simil madera",
      perfil: "papu",
    },
  },

  // ====================
  // GRANDE CON TRAVESAÑOS
  // ====================

  {
    nombre: "Pano Fijo 240x240 Dos Travesanos",
    payload: {
      tipo: "pano_fijo",
      ancho: 240,
      alto: 240,
      linea: "herrero",
      color: "blanco",
      tipoVidrio: "4mm",
      perfil: "papu",

      travesanoVertical: true,
      travesanoHorizontal: true,
    },
  },
];

const resultados = [];

for (const test of casos) {
  try {
    const res = calcularSuperficie(test.payload);

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

const destino = path.join(__dirname, "output", "qa_superficies.csv");

fs.writeFileSync(destino, csv);

console.log("");
console.log("=================================");
console.log("QA SUPERFICIES FINALIZADO");
console.log("Archivo:", destino);
console.log("=================================");
