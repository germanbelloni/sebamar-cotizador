const { fromRoot } = require("../../utils/path");

const calcular = require(
  fromRoot("services/patagonicas/calcularPatagonicaModena"),
);

console.log("\n🧪 TEST SERVICE PATAGÓNICA MODENA\n");

const casos = [
  {
    nombre: "base 4mm",
    input: {
      tipo: "1_raja",
      medida: "150x100",
      color: "blanco",
      tipoVidrio: "4mm",
    },
  },

  {
    nombre: "negra dvh",
    input: {
      tipo: "1_raja",
      medida: "150x100",
      color: "negro",
      tipoVidrio: "dvh",
    },
  },

  {
    nombre: "bronce dvh 5+9+5",
    input: {
      tipo: "2_rajas",
      medida: "200x100",
      color: "bronce",
      tipoVidrio: "dvh_5_9_5",
    },
  },

  {
    nombre: "laminado 4+4",
    input: {
      tipo: "1_raja",
      medida: "150x150",
      color: "blanco",
      tipoVidrio: "4+4",
    },
  },
];

// =========================
// VALIDADOR
// =========================

function validar(res) {
  const errores = [];

  if (!res) {
    errores.push("sin response");
  }

  if (typeof res.costoBase !== "number") {
    errores.push("costoBase inválido");
  }

  if (!Array.isArray(res.items)) {
    errores.push("items inválidos");
  }

  if (res.costoBase <= 0) {
    errores.push("costoBase <= 0");
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

console.log("\n✅ FIN TEST SERVICE\n");
