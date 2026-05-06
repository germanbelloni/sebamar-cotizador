const calcular = require("../../wrappers/mosquiteros/calcularMosquiteroVentana");

console.log("\n🧪 TEST MOSQUITEROS\n");

[
  { ancho: 100, alto: 100 },
  { ancho: 120, alto: 120, color: "negro" },
].forEach((t, i) => {
  try {
    const r = calcular(t);
    console.log(`✔️ ${i + 1}`, r.precioVenta);
  } catch (e) {
    console.log(`💥 ${i + 1}`, e.message);
  }
});
