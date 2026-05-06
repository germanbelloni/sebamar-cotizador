const { fromRoot } = require("../../utils/path");

const calcular = require(
  fromRoot("services/patagonicas/calcularPatagonicaModena"),
);

console.log("\n🧪 TEST SERVICE PATAGONICA MODENA\n");

const casos = [
  {
    nombre: "base 1 raja",
    input: {
      tipo: "1_raja",
      medida: "150x100",
      color: "blanco",
      tipoVidrio: "4mm",
    },
  },
  {
    nombre: "2 rajas",
    input: {
      tipo: "2_rajas",
      medida: "200x60",
      color: "blanco",
      tipoVidrio: "4mm",
    },
  },
  {
    nombre: "color negro",
    input: {
      tipo: "1_raja",
      medida: "150x100",
      color: "negro",
      tipoVidrio: "4mm",
    },
  },
  {
    nombre: "vidrio 3+3",
    input: {
      tipo: "1_raja",
      medida: "150x100",
      tipoVidrio: "3+3",
    },
  },
  {
    nombre: "dvh",
    input: {
      tipo: "1_raja",
      medida: "150x150",
      tipoVidrio: "dvh",
    },
  },
  {
    nombre: "dvh 5+9+5",
    input: {
      tipo: "1_raja",
      medida: "150x150",
      tipoVidrio: "dvh_5_9_5",
    },
  },
  {
    nombre: "error tipo",
    input: {
      tipo: "3_rajas",
      medida: "150x100",
    },
  },
  {
    nombre: "error medida",
    input: {
      tipo: "1_raja",
      medida: "999x999",
    },
  },
];

// =========================
// VALIDADOR
// =========================
function validar(res) {
  const errores = [];

  if (!res) errores.push("sin respuesta");

  if (typeof res.total !== "number") {
    errores.push("total inválido");
  }

  if (res.total <= 0) {
    errores.push("total <= 0");
  }

  return errores;
}

// =========================
// RUN
// =========================
casos.forEach((test, i) => {
  try {
    const res = calcular(test.input);

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
