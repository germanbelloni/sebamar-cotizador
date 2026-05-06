const { fromRoot } = require("../../utils/path");

const calcular = require(fromRoot("wrappers/superficies/calcularSuperficies"));

console.log("\n🧪 TEST WRAPPER SUPERFICIES\n");

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
      ancho: 120,
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
      ancho: 120,
      alto: 100,
    },
  },
  {
    nombre: "contramarco negro",
    input: {
      tipo: "contramarco",
      ancho: 150,
      alto: 100,
      color: "negro",
    },
  },
];

casos.forEach((t, i) => {
  try {
    const r = calcular(t.input);

    if (!r.precioVenta || r.precioVenta <= 0) {
      throw new Error("precioVenta inválido");
    }

    console.log(`✔️ [${i + 1}] ${t.nombre}`);
    console.log("   👉 venta:", r.precioVenta);
    console.log("   👉 costo:", r.costo);
    console.log("   👉 ganancia:", r.ganancia);
  } catch (e) {
    console.log(`💥 [${i + 1}] ${t.nombre}`);
    console.log("   👉", e.message);
  }
});

console.log("\n✅ FIN TEST WRAPPER\n");
