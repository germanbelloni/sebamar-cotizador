const { fromRoot } = require("../../utils/path");

const calcular = require(fromRoot("wrappers/postigones/calcularPostigones"));

console.log("\n🧪 TEST WRAPPER POSTIGONES\n");

const casos = [
  {
    nombre: "base",
    input: {
      ancho: 120,
      alto: 100,
      tipo: "corredizo",
      color: "blanco",
    },
  },
  {
    nombre: "color negro",
    input: {
      ancho: 120,
      alto: 100,
      tipo: "corredizo",
      color: "negro",
    },
  },
  {
    nombre: "con extras",
    input: {
      ancho: 120,
      alto: 100,
      tipo: "abrir",
      color: "blanco",
      extras: { microperforado: true },
    },
  },
];

casos.forEach((t, i) => {
  try {
    const r = calcular(t.input);

    console.log(`✔️ [${i + 1}] ${t.nombre}`);
    console.log("   👉 venta:", r.precioVenta);
    console.log("   👉 costo:", r.costo);
  } catch (e) {
    console.log(`💥 [${i + 1}] ${t.nombre}`);
    console.log("   👉", e.message);
  }
});

console.log("\n✅ FIN TEST\n");
