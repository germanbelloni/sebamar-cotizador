const { fromRoot } = require("../../utils/path");

const calcularRaja = require(fromRoot("backend/services/rajas/calcularRaja"));

console.log("\n🧪 TEST SERVICE RAJA MODENA\n");

const casos = [
  {
    nombre: "base 4mm",
    input: {
      medida: "60x60",
      tipoVidrio: "4mm",
      color: "blanco",
      linea: "modena",
    },
  },
  {
    nombre: "vidrio 3+3",
    input: {
      medida: "60x60",
      tipoVidrio: "3+3",
      color: "blanco",
      linea: "modena",
    },
  },
  {
    nombre: "color negro",
    input: {
      medida: "60x60",
      tipoVidrio: "4mm",
      color: "negro",
      linea: "modena",
    },
  },
];

// =========================
// VALIDADOR
// =========================
function validar(res) {
  const errores = [];

  if (!res) errores.push("sin respuesta");

  if (typeof res.costoBase !== "number") {
    errores.push("costoBase inválido");
  }

  if (res.costoBase <= 0) {
    errores.push("costoBase <= 0");
  }

  return errores;
}

// =========================
// RUN
// =========================
casos.forEach((test, i) => {
  try {
    const res = calcularRaja(test.input);

    const errores = validar(res);

    if (errores.length) {
      console.log(`❌ [${i + 1}] ${test.nombre}`);
      errores.forEach((e) => console.log("   -", e));
    } else {
      console.log(`✔️ [${i + 1}] ${test.nombre}`);
    }
  } catch (err) {
    console.log(`💥 [${i + 1}] ${test.nombre}`);
    console.log("   -", err.message);
  }
});

console.log("\n✅ FIN TEST SERVICE\n");
