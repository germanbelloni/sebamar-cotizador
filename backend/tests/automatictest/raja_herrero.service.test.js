const { fromRoot } = require("../../utils/path");

const calcularRaja = require(fromRoot("services/rajas/calcularRaja"));

console.log("\n🧪 TEST SERVICE RAJA HERRERO\n");

const casos = [
  {
    nombre: "base 4mm",
    input: {
      medida: "60x60",
      tipoVidrio: "4mm",
      linea: "herrero",
    },
  },
  {
    nombre: "vidrio 3+3",
    input: {
      medida: "60x60",
      tipoVidrio: "3+3",
      linea: "herrero",
    },
  },
];

function validar(res) {
  const errores = [];

  if (!res) errores.push("sin respuesta");

  if (typeof res.costoBase !== "number") {
    errores.push("costoBase inválido");
  }

  if (!Array.isArray(res.items)) {
    errores.push("items inválidos");
  }

  return errores;
}

casos.forEach((t, i) => {
  try {
    const res = calcularRaja(t.input);
    const errores = validar(res);

    if (errores.length) {
      console.log(`❌ [${i + 1}] ${t.nombre}`);
      errores.forEach((e) => console.log("   -", e));
    } else {
      console.log(`✔️ [${i + 1}] ${t.nombre}`);
    }
  } catch (err) {
    console.log(`💥 [${i + 1}] ${t.nombre}`);
    console.log("   -", err.message);
  }
});

console.log("\n✅ FIN TEST SERVICE\n");
