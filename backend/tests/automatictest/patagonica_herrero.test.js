const { fromRoot } = require("../../utils/path");

const calcular = require(
  fromRoot("wrappers/patagonicas/calcularPatagonicaHerrero"),
);

console.log("\n🧪 TEST WRAPPER HERRERO\n");

const casos = [
  {
    medidaTotal: "200x100",
    tipo: "2_rajas",
    raja: { ancho: 50, tipoVidrio: "4mm" },
    color: "simil madera",
  },
];

casos.forEach((c, i) => {
  try {
    const r = calcular(c);

    if (!r.precioVenta) throw new Error("sin venta");

    console.log(`✔ [${i + 1}] OK`);
  } catch (e) {
    console.log(`❌ [${i + 1}]`, e.message);
  }
});
