const { fromRoot } = require("../../utils/path");

const calcularRaja = require(fromRoot("services/rajas/calcularRaja"));

console.log("\n🧪 TEST SERVICE RAJA MODENA\n");

const casos = [
  {
    nombre: "base",
    input: {
      medida: "60x60",
      tipoVidrio: "4mm",
      linea: "modena",
    },
  },
  {
    nombre: "dvh",
    input: {
      medida: "60x60",
      tipoVidrio: "dvh",
      linea: "modena",
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
