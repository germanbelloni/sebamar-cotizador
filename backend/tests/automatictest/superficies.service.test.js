const { fromRoot } = require("../../utils/path");

const calcularSuperficie = require(
  fromRoot("services/superficies/Superficies"),
);

console.log("\n🧪 TEST SERVICE SUPERFICIES\n");

const casos = [
  {
    nombre: "paño fijo base",
    input: {
      tipo: "pano_fijo",
      ancho: 100,
      alto: 100,
      linea: "herrero",
      tipoVidrio: "4mm",
    },
  },
  {
    nombre: "paño fijo negro",
    input: {
      tipo: "pano_fijo",
      ancho: 100,
      alto: 100,
      linea: "herrero",
      tipoVidrio: "4mm",
      color: "negro",
    },
  },
  {
    nombre: "premarco",
    input: {
      tipo: "premarco",
      ancho: 100,
      alto: 100,
    },
  },
  {
    nombre: "contramarco negro",
    input: {
      tipo: "contramarco",
      ancho: 100,
      alto: 100,
      color: "negro",
    },
  },
];

casos.forEach((t, i) => {
  try {
    const r = calcularSuperficie(t.input);

    if (!r.costo || r.costo <= 0) {
      throw new Error("costo inválido");
    }

    console.log(`✔️ [${i + 1}] ${t.nombre}`);
    console.log("   👉 costo:", r.costo);
  } catch (e) {
    console.log(`💥 [${i + 1}] ${t.nombre}`);
    console.log("   👉", e.message);
  }
});

console.log("\n✅ FIN TEST SERVICE\n");
