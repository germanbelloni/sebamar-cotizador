const { fromRoot } = require("../../utils/path");

const calcular = require(
  fromRoot("backend/services/placas/calcularPuertaPlaca"),
);

console.log("\n🧪 TEST SERVICE PLACAS\n");

const casos = [
  {
    nombre: "placa base",
    input: {
      tipo: "placa",
      modelo: "finger_pino",
      medida: "070x200",
      marco: "marco_10",
    },
  },
  {
    nombre: "embutir base",
    input: {
      tipo: "embutir",
      modelo: "finger_pino",
      medida: "080x200",
      marco: "marco_15",
    },
  },
  {
    nombre: "error modelo",
    input: {
      tipo: "placa",
      modelo: "no_existe",
      medida: "070x200",
      marco: "marco_10",
    },
  },
];

// =========================
// 🧠 VALIDADOR
// =========================
function validar(res) {
  const errores = [];

  if (!res) errores.push("sin respuesta");

  if (typeof res.base !== "number") {
    errores.push("base inválido");
  }

  if (res.base <= 0) {
    errores.push("base <= 0");
  }

  return errores;
}

// =========================
// 🚀 RUN
// =========================
casos.forEach((t, i) => {
  try {
    const r = calcular(t.input);

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
