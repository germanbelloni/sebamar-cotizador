const { fromRoot } = require("../../utils/path");

const calcular = require(
  fromRoot("services/patagonicas/calcularPatagonicaHerrero"),
);

console.log("\n🧪 TEST SERVICE HERRERO\n");

const casos = [
  {
    medidaTotal: "150x100",
    tipo: "1_raja",
    raja: { ancho: 50, tipoVidrio: "4mm" },
    color: "blanco",
  },
];

casos.forEach((c, i) => {
  try {
    const r = calcular(c);

    if (!r.total) throw new Error("sin total");

    console.log(`✔ [${i + 1}] OK`);
  } catch (e) {
    console.log(`❌ [${i + 1}]`, e.message);
  }
});
