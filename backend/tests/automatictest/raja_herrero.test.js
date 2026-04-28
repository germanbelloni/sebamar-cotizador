const { fromRoot } = require("../../utils/path");

const calcularRajaHerrero = require(
  fromRoot("wrappers/rajas/calcularRajaHerrero"),
);

console.log("\n🧪 TEST WRAPPER RAJA HERRERO\n");

const casos = [
  {
    nombre: "base",
    input: {
      ancho: 60,
      alto: 60,
      color: "blanco",
      vidrio: "4mm",
    },
  },
  {
    nombre: "con mosquitero",
    input: {
      ancho: 60,
      alto: 60,
      color: "blanco",
      vidrio: "4mm",
      mosquitero: true,
    },
  },
  {
    nombre: "modelo brazo",
    input: {
      ancho: 60,
      alto: 60,
      color: "blanco",
      vidrio: "4mm",
      modelo: "brazo",
    },
  },
  {
    nombre: "altura >150",
    input: {
      ancho: 60,
      alto: 160,
      color: "blanco",
      vidrio: "4mm",
    },
  },
];

casos.forEach((t, i) => {
  try {
    calcularRajaHerrero(t.input);
    console.log(`✔️ [${i + 1}] ${t.nombre}`);
  } catch (e) {
    console.log(`💥 [${i + 1}] ${t.nombre}`);
    console.log("   -", e.message);
  }
});

console.log("\n✅ FIN TEST WRAPPER\n");
