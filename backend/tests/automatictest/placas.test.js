const { fromRoot } = require("../../utils/path");

const calcular = require(fromRoot("wrappers/placas/calcularPuertaPlaca"));

console.log("\n🧪 TEST WRAPPER PLACAS\n");

const casos = [
  {
    nombre: "base normal",
    input: {
      ancho: 70,
      alto: 200,
      tipo: "placa",
      modelo: "finger_pino",
      marco: "marco_10",
    },
  },
  {
    nombre: "ancho 90 (recargo 10%)",
    input: {
      ancho: 90,
      alto: 200,
      tipo: "placa",
      modelo: "finger_pino",
      marco: "marco_10",
    },
  },
  {
    nombre: "ancho 100 (recargo 20%)",
    input: {
      ancho: 100,
      alto: 200,
      tipo: "placa",
      modelo: "finger_pino",
      marco: "marco_10",
    },
  },
  {
    nombre: "alto 205",
    input: {
      ancho: 80,
      alto: 205,
      tipo: "placa",
      modelo: "finger_pino",
      marco: "marco_10",
    },
  },
];

casos.forEach((t, i) => {
  try {
    const r = calcular(t.input);

    console.log(`✔️ [${i + 1}] ${t.nombre}`);
    console.log("   👉 total:", r.total);
  } catch (e) {
    console.log(`💥 [${i + 1}] ${t.nombre}`);
    console.log("   👉", e.message);
  }
});

console.log("\n✅ FIN TEST WRAPPER\n");
