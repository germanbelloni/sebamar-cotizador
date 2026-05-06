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

function validar(res) {
  const errores = [];

  if (typeof res.estructura !== "number") {
    errores.push("estructura inválida");
  }

  if (typeof res.vidrio !== "number") {
    errores.push("vidrio inválido");
  }

  if (typeof res.subtotal !== "number") {
    errores.push("subtotal inválido");
  }

  return errores;
}

casos.forEach((t, i) => {
  try {
    const r = calcularRaja(t.input);

    const errores = validar(r);

    if (errores.length) {
      console.log(`❌ [${i + 1}] ${t.nombre}`);

      errores.forEach((e) => console.log("   -", e));
    } else {
      console.log(`✔️ [${i + 1}] ${t.nombre}`);
    }
  } catch (e) {
    console.log(`💥 [${i + 1}] ${t.nombre}`);

    console.log("   -", e.message);
  }
});

console.log("\n✅ FIN TEST SERVICE\n");
