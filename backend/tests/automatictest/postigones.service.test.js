const { fromRoot } = require("../../utils/path");

const calcular = require(
  fromRoot("backend/services/postigones/calcularPostigon"),
);

console.log("\n🧪 TEST SERVICE POSTIGONES\n");

const casos = [
  {
    nombre: "corredizo base",
    input: {
      medida: "120x60",
      tipo: "corredizo",
      color: "blanco",
    },
  },
  {
    nombre: "abrir base",
    input: {
      medida: "120x60",
      tipo: "abrir",
      color: "negro",
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

console.log("\n✅ FIN TEST SERVICE\n");
