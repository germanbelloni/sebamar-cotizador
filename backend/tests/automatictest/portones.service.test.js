const { fromRoot } = require("../../utils/path");

const calcularPortones = require(
  fromRoot("backend/services/portones/calcularPortones"),
);

console.log("\n🧪 TEST SERVICE PORTONES\n");

const casos = [
  {
    nombre: "portón 3 hojas abrir",
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
    nombre: "portón corredizo",
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
  {
    nombre: "error hojas",
    input: {
      ancho: 220,
      alto: 200,
      hojas: 5,
      tipo: "abrir",
      modelo: "modelo 4",
      linea: "herrero",
    },
    error: true,
  },
];

casos.forEach((t, i) => {
  try {
    const r = calcularPortones(t.input);

    if (t.error) {
      console.log(`💥 [${i + 1}] ${t.nombre} (debería fallar)`);
      return;
    }

    console.log(`✔️ [${i + 1}] ${t.nombre}`);
    console.log("   👉 costo:", r.costo);
    console.log("   👉 hojas:", r.hojas);
  } catch (e) {
    if (t.error) {
      console.log(`✔️ [${i + 1}] ${t.nombre} (error esperado)`);
    } else {
      console.log(`💥 [${i + 1}] ${t.nombre}`);
      console.log("   👉 ERROR:", e.message);
    }
  }
});

console.log("\n✅ FIN TEST SERVICE\n");
