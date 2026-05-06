const { fromRoot } = require("../../utils/path");

const calcular = require(
  fromRoot("backend/services/mosquiteros/calcularMosquitero"),
);

console.log("\n🧪 TEST SERVICE MOSQUITEROS\n");

const casos = [
  {
    nombre: "base blanco",
    input: {
      medida: "100x0,50",
      color: "blanco",
    },
  },
  {
    nombre: "color negro",
    input: {
      medida: "100x0,50",
      color: "negro",
    },
  },
  {
    nombre: "color simil madera",
    input: {
      medida: "120x0,50",
      color: "simil madera",
    },
  },
];

casos.forEach((t, i) => {
  try {
    const r = calcular(t.input);

    if (!r.costoBase || r.costoBase <= 0) {
      throw new Error("costoBase inválido");
    }

    console.log(`✔️ [${i + 1}] ${t.nombre}`);
    console.log("   👉 costoBase:", r.costoBase);
  } catch (e) {
    console.log(`💥 [${i + 1}] ${t.nombre}`);
    console.log("   👉", e.message);
  }
});

console.log("\n✅ FIN TEST SERVICE\n");
