const { fromRoot } = require("../../utils/path");

const calcular = require(
  fromRoot("wrappers/patagonicas/calcularPatagonicaModena"),
);

console.log("\n🧪 TEST WRAPPER PATAGÓNICA MODENA\n");

const casos = [
  {
    nombre: "base blanca",
    input: {
      medida: "150x100",
      cantidadRajas: 1,
      tipoVidrio: "4mm",
      color: "blanco",
    },
  },

  {
    nombre: "negra dvh",
    input: {
      medida: "150x100",
      cantidadRajas: 1,
      tipoVidrio: "dvh",
      color: "negro",
    },
  },

  {
    nombre: "bronce 2 rajas",
    input: {
      medida: "200x100",
      cantidadRajas: 2,
      tipoVidrio: "dvh_5_9_5",
      color: "bronce",
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
