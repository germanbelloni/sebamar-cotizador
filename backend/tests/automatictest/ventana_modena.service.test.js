const { fromRoot } = require("../../utils/path");

const calcularVentana = require(
  fromRoot("backend/services/ventanas/calcularVentana"),
);

console.log("\n🧪 TEST AUTOMÁTICO - SERVICE MODENA\n");

// =========================
// CASOS
// =========================
const casos = [
  {
    nombre: "base 3mm",
    input: {
      medida: "120x100",
      color: "blanco",
      tipoVidrio: "3mm",
      linea: "modena",
    },
  },
  {
    nombre: "vidrio 4mm",
    input: {
      medida: "120x100",
      color: "blanco",
      tipoVidrio: "4mm",
      linea: "modena",
    },
  },
  {
    nombre: "vidrio 3+3",
    input: {
      medida: "120x100",
      color: "blanco",
      tipoVidrio: "3+3",
      linea: "modena",
    },
  },
  {
    nombre: "vidrio dvh",
    input: {
      medida: "120x100",
      color: "blanco",
      tipoVidrio: "dvh",
      linea: "modena",
    },
  },
  {
    nombre: "color negro",
    input: {
      medida: "120x100",
      color: "negro",
      tipoVidrio: "3mm",
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

  if (typeof res.linea !== "string") {
    errores.push("linea inválida");
  }

  if (typeof res.medida !== "string") {
    errores.push("medida inválida");
  }

  if (typeof res.costoBase !== "number") {
    errores.push("costoBase inválido");
  }

  if (res.costoBase <= 0) {
    errores.push("costoBase <= 0");
  }

  if (typeof res.costoGuia !== "number") {
    errores.push("costoGuia inválido");
  }

  if (typeof res.costoMosquitero !== "number") {
    errores.push("costoMosquitero inválido");
  }

  if (typeof res.incluyeGuia !== "boolean") {
    errores.push("incluyeGuia inválido");
  }

  if (typeof res.incluyeMosquitero !== "boolean") {
    errores.push("incluyeMosquitero inválido");
  }

  return errores;
}

// =========================
// RUN
// =========================
casos.forEach((test, i) => {
  try {
    const res = calcularVentana(test.input);

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
