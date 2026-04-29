const { fromRoot } = require("../../utils/path");

const calcular = require(
  fromRoot("backend/services/placas/calcularPuertaPlaca"),
);

console.log("\n🧪 TEST SERVICE PLACAS\n");

const casos = [
  {
    nombre: "base placa",
    input: {
      tipo: "placa",
      modelo: "finger_pino",
      medida: "070x200",
      marco: "marco_10",
    },
  },
  {
    nombre: "base embutir",
    input: {
      tipo: "embutir",
      modelo: "cedro_cedro",
      medida: "080x200",
      marco: "marco_10",
    },
  },
];

casos.forEach((t, i) => {
  try {
    const r = calcular(t.input);

    console.log(`✔️ [${i + 1}] ${t.nombre}`);
    console.log("   👉 base:", r.base);
  } catch (e) {
    console.log(`💥 [${i + 1}] ${t.nombre}`);
    console.log("   👉", e.message);
  }
});

console.log("\n✅ FIN TEST SERVICE\n");
