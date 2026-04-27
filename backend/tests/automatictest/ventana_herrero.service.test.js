const { fromRoot } = require("../../utils/path");

const calcularVentana = require(fromRoot("services/ventanas/calcularVentana"));

// =========================
// 🧪 CASOS DE PRUEBA (SERVICE)
// =========================
const casos = [
  {
    nombre: "base sola",
    input: {
      medida: "120x100",
      color: "blanco",
      incluirGuia: false,
      incluirMosquitero: false,
      linea: "herrero",
    },
  },
  {
    nombre: "con guía",
    input: {
      medida: "120x100",
      color: "blanco",
      incluirGuia: true,
      incluirMosquitero: false,
      linea: "herrero",
    },
  },
  {
    nombre: "con mosquitero",
    input: {
      medida: "120x100",
      color: "blanco",
      incluirGuia: false,
      incluirMosquitero: true,
      linea: "herrero",
    },
  },
  {
    nombre: "completo",
    input: {
      medida: "120x100",
      color: "blanco",
      incluirGuia: true,
      incluirMosquitero: true,
      linea: "herrero",
    },
  },
  {
    nombre: "color distinto",
    input: {
      medida: "120x100",
      color: "negro",
      incluirGuia: true,
      incluirMosquitero: true,
      linea: "herrero",
    },
  },
];

// =========================
// 🧠 VALIDADOR SERVICE
// =========================
function validar(resultado) {
  const errores = [];

  if (typeof resultado.costoBase !== "number") {
    errores.push("costoBase inválido");
  }

  if (typeof resultado.costoGuia !== "number") {
    errores.push("costoGuia inválido");
  }

  if (typeof resultado.costoMosquitero !== "number") {
    errores.push("costoMosquitero inválido");
  }

  if (typeof resultado.incluyeGuia !== "boolean") {
    errores.push("incluyeGuia inválido");
  }

  if (typeof resultado.incluyeMosquitero !== "boolean") {
    errores.push("incluyeMosquitero inválido");
  }

  // coherencia básica
  if (!resultado.incluyeGuia && resultado.costoGuia > 0) {
    errores.push("guia cobrada sin incluir");
  }

  if (!resultado.incluyeMosquitero && resultado.costoMosquitero > 0) {
    errores.push("mosquitero cobrado sin incluir");
  }

  return errores;
}

// =========================
// 🚀 RUN TESTS
// =========================
console.log("\n🧪 TEST AUTOMÁTICO - SERVICE VENTANAS HERRERO\n");

casos.forEach((test, index) => {
  try {
    const resultado = calcularVentana(test.input);

    const errores = validar(resultado);

    if (errores.length > 0) {
      console.log(`❌ [${index + 1}] ${test.nombre}`);
      errores.forEach((e) => console.log("   -", e));
    } else {
      console.log(`✔️ [${index + 1}] ${test.nombre}`);
    }
  } catch (err) {
    console.log(`💥 [${index + 1}] ${test.nombre}`);
    console.log("   - error ejecución:", err.message);
  }
});

console.log("\n✅ FIN TEST SERVICE\n");
