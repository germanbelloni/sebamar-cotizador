const { fromRoot } = require("../../utils/path");

const calcular = require(
  fromRoot("wrappers/patagonicas/calcularPatagonicaHerrero"),
);

console.log("\n🧪 TEST WRAPPER PATAGÓNICA HERRERO\n");

const casos = [
  {
    nombre: "base blanca",
    input: {
      medidaTotal: "150x100",
      tipo: "1_raja",
      color: "blanco",
      raja: {
        tipoVidrio: "4mm",
      },
    },
  },

  {
    nombre: "negra 2 rajas",
    input: {
      medidaTotal: "200x100",
      tipo: "2_rajas",
      color: "negro",
      raja: {
        tipoVidrio: "4mm",
      },
    },
  },

  {
    nombre: "simil madera",
    input: {
      medidaTotal: "200x150",
      tipo: "1_raja",
      color: "simil madera",
      raja: {
        tipoVidrio: "4+4",
      },
    },
  },
];

// =========================
// VALIDADOR
// =========================

function validar(res) {
  const errores = [];

  if (typeof res.precioVenta !== "number") {
    errores.push("precioVenta inválido");
  }

  if (typeof res.costo !== "number") {
    errores.push("costo inválido");
  }

  if (!Array.isArray(res.items)) {
    errores.push("items inválidos");
  }

  if (res.ganancia !== res.precioVenta - res.costo) {
    errores.push("ganancia inconsistente");
  }

  if (!res.configuracion?.svg) {
    errores.push("falta svg");
  }

  return errores;
}

// =========================
// RUN
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

    console.log("   👉", e.message);
  }
});

console.log("\n✅ FIN TEST WRAPPER\n");
