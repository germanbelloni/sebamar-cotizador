const { fromRoot } = require("../../utils/path");

const calcular = require(fromRoot("wrappers/placas/calcularPuertaPlaca"));

console.log("\n🧪 TEST WRAPPER PLACAS\n");

const casos = [
  {
    nombre: "base simple",
    input: {
      ancho: 80,
      alto: 200,
      tipo: "placa",
      modelo: "finger_pino",
      marco: "marco_10",
    },
  },
  {
    nombre: "con recargo ancho",
    input: {
      ancho: 90,
      alto: 200,
      tipo: "placa",
      modelo: "finger_pino",
      marco: "marco_10",
    },
  },
  {
    nombre: "con recargo alto",
    input: {
      ancho: 80,
      alto: 205,
      tipo: "placa",
      modelo: "finger_pino",
      marco: "marco_10",
    },
  },
  {
    nombre: "mano izquierda (svg)",
    input: {
      ancho: 80,
      alto: 200,
      tipo: "placa",
      modelo: "finger_pino",
      marco: "marco_10",
      mano: "izquierda",
    },
  },
];

// =========================
// 🧠 VALIDADOR
// =========================
function validar(res) {
  const errores = [];

  if (typeof res.precioVenta !== "number") {
    errores.push("precioVenta inválido");
  }

  if (typeof res.costo !== "number") {
    errores.push("costo inválido");
  }

  if (typeof res.ganancia !== "number") {
    errores.push("ganancia inválida");
  }

  if (!Array.isArray(res.items)) {
    errores.push("items no es array");
  }

  if (!res.configuracion?.svg) {
    errores.push("falta svg");
  }

  if (res.ganancia !== res.precioVenta - res.costo) {
    errores.push("ganancia mal calculada");
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

console.log("\n✅ FIN TEST WRAPPER\n");
