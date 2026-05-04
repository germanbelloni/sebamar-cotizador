const { fromRoot } = require("../../utils/path");

const calcularPuertaWrapper = require(
  fromRoot("wrappers/puertas/calcularPuerta"),
);

console.log("\n🧪 TEST WRAPPER PUERTAS\n");

const casos = [
  {
    nombre: "simple",
    input: {
      ancho: 80,
      alto: 200,
      linea: "herrero",
      modelo: "modelo 4",
      color: "blanco",
      tipoVidrio: "4mm",
    },
  },
  {
    nombre: "puerta y media",
    input: {
      tipo: "puerta_y_media",
      linea: "herrero",
      modeloPuerta: "modelo 4",
      modeloMedia: "1 travesaño",
      color: "negro",
      tipoVidrio: "4mm",
    },
  },
];

casos.forEach((t, i) => {
  try {
    const r = calcularPuertaWrapper(t.input);

    console.log(`✔️ [${i + 1}] ${t.nombre}`);
    console.log("   👉 total:", r.total);
  } catch (e) {
    console.log(`💥 [${i + 1}] ${t.nombre}`);
    console.log("   👉 ERROR:", e.message);
  }
});

console.log("\n✅ FIN TEST WRAPPER\n");
