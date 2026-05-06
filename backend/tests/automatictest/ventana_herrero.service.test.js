const { fromRoot } = require("../../utils/path");

const calcularPorton = require(fromRoot("wrappers/portones/calcularporton"));

console.log("\n🧪 TEST WRAPPER PORTONES\n");

const casos = [
  {
    nombre: "portón base",
    input: {
      ancho: 240,
      alto: 200,
      hojas: 3,
      tipo: "abrir",
      modelo: "modelo 4",
      linea: "herrero",
      color: "blanco",
      tipoVidrio: "4mm",
      apertura: "izquierda_izquierda",
    },
  },
  {
    nombre: "portón corredizo negro",
    input: {
      ancho: 300,
      alto: 210,
      hojas: 4,
      tipo: "corredizo",
      modelo: "modelo 4",
      linea: "modena",
      color: "negro",
      tipoVidrio: "4mm",
      apertura: "derecha_izquierda",
    },
  },
];

casos.forEach((t, i) => {
  try {
    const r = calcularPorton(t.input);

    console.log(`✔️ [${i + 1}] ${t.nombre}`);
    console.log("   👉 total:", r.total);
    console.log("   👉 costo:", r.costo);
    console.log("   👉 ganancia:", r.ganancia);
  } catch (e) {
    console.log(`💥 [${i + 1}] ${t.nombre}`);
    console.log("   👉 ERROR:", e.message);
  }
});

console.log("\n✅ FIN TEST WRAPPER\n");
