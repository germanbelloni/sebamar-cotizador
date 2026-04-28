const { fromRoot } = require("../../utils/path");

const calcular = require(fromRoot("wrappers/postigones/calcularPostigones"));

console.log("\n🧪 TEST WRAPPER POSTIGONES\n");

const casos = [
  {
    nombre: "base corredizo",
    input: {
      ancho: 120,
      alto: 100,
      tipo: "corredizo",
      color: "blanco",
    },
  },
  {
    nombre: "3 hojas corredizo",
    input: {
      ancho: 180,
      alto: 100,
      tipo: "corredizo",
      hojas: 3,
    },
  },
  {
    nombre: "abrir 4 hojas",
    input: {
      ancho: 210,
      alto: 100,
      tipo: "abrir",
      hojas: 4,
    },
  },
  {
    nombre: "microperforado",
    input: {
      ancho: 120,
      alto: 100,
      tipo: "abrir",
      extras: { microperforado: true },
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
