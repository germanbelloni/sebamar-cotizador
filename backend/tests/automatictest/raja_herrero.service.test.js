const { fromRoot } = require("../../utils/path");

const calcularRaja = require(fromRoot("backend/services/rajas/calcularRaja"));

console.log("\n🧪 TEST SERVICE RAJA HERRERO\n");

const casos = [
  {
    nombre: "base",
    input: {
      medida: "60x60",
      color: "blanco",
      tipoVidrio: "4mm",
    },
  },
  {
    nombre: "color negro",
    input: {
      medida: "60x60",
      color: "negro",
      tipoVidrio: "4mm",
    },
  },
];

casos.forEach((t, i) => {
  try {
    const r = calcularRaja(t.input);

    if (!r.costoBase || r.costoBase <= 0) {
      throw new Error("costo inválido");
    }

    console.log(`✔️ [${i + 1}] ${t.nombre}`);
  } catch (e) {
    console.log(`💥 [${i + 1}] ${t.nombre}`);
    console.log("   -", e.message);
  }
});

console.log("\n✅ FIN TEST SERVICE\n");
