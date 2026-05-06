const { fromRoot } = require("../../utils/path");

const calcular = require(fromRoot("services/postigones/calcularPostigon"));

console.log("\n🧪 TEST SERVICE POSTIGONES\n");

const r = calcular({
  medida: "120x60",
  tipo: "corredizo",
});

console.log("👉 costoBase:", r.costoBase);
console.log("👉 items:", r.items);

console.log("\n✅ FIN TEST\n");
