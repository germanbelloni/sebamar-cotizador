const { fromRoot } = require("../../utils/path");

const calcularVentanaModena = require(
  fromRoot("wrappers/ventanas/calcularVentanaModena"),
);

console.log("\n🧪 TEST WRAPPER MODENA\n");

const casos = [
  {
    nombre: "bipunto mixto",
    input: {
      ancho: 120,
      alto: 100,
      color: "blanco",
      tipoVidrio: "4mm",
      bipuntos: [{ tipo: "comun" }, { tipo: "llave" }],
    },
  },
  {
    nombre: "2 bipuntos llave",
    input: {
      ancho: 120,
      alto: 100,
      color: "blanco",
      tipoVidrio: "4mm",
      bipuntos: [{ tipo: "llave" }, { tipo: "llave" }],
    },
  },
];

casos.forEach((t, i) => {
  try {
    calcularVentanaModena(t.input);
    console.log(`✔️ [${i + 1}] ${t.nombre}`);
  } catch (err) {
    console.log(`💥 [${i + 1}] ${t.nombre}`);
    console.log("   -", err.message);
  }
});

console.log("\n✅ FIN TEST\n");
