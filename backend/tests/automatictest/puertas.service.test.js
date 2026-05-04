const { fromRoot } = require("../../utils/path");

const calcularPuertas = require(
  fromRoot("backend/services/puertas/calcularPuertas"),
);

console.log("\n🧪 TEST SERVICE PUERTAS\n");

const casos = [
  {
    nombre: "puerta base",
    input: {
      linea: "herrero",
      modelo: "modelo 4",
      medida: "80x200",
      color: "blanco",
      tipoVidrio: "4mm",
    },
  },
  {
    nombre: "puerta doble",
    input: {
      linea: "modena",
      modelo: "modelo 4",
      medida: "160x200",
      tipo: "doble",
      color: "blanco",
      tipoVidrio: "4mm",
    },
  },
  {
    nombre: "puerta y media herrero",
    input: {
      tipo: "puerta_y_media",
      linea: "herrero",
      modeloPuerta: "modelo 4",
      modeloMedia: "1 travesaño",
      color: "blanco",
      tipoVidrio: "4mm",
    },
  },
];

casos.forEach((t, i) => {
  try {
    const r = calcularPuertas(t.input);

    console.log(`✔️ [${i + 1}] ${t.nombre}`);
    console.log("   👉 costo:", r.costo);
    console.log("   👉 hojas:", r.hojas);
  } catch (e) {
    console.log(`💥 [${i + 1}] ${t.nombre}`);
    console.log("   👉 ERROR:", e.message);
  }
});

console.log("\n✅ FIN TEST SERVICE\n");
