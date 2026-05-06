const { fromRoot } = require("../../utils/path");

const calcular = require(fromRoot("wrappers/rajas/calcularRajaModena"));

console.log("\n🧪 TEST WRAPPER RAJA MODENA\n");

const casos = [
  {
    nombre: "base",
    input: {
      ancho: 60,
      alto: 60,
      color: "blanco",
    },
  },
  {
    nombre: "con herraje blanco",
    input: {
      ancho: 60,
      alto: 60,
      color: "blanco",
      herrajesBlancos: true,
    },
  },
  {
    nombre: "con contramarco",
    input: {
      ancho: 60,
      alto: 60,
      color: "negro",
      contramarco: true,
    },
  },
];

casos.forEach((t, i) => {
  try {
    calcular(t.input);
    console.log(`✔️ [${i + 1}] ${t.nombre}`);
  } catch (e) {
    console.log(`💥 [${i + 1}] ${t.nombre}`);
    console.log("   -", e.message);
  }
});

console.log("\n✅ FIN TEST\n");
