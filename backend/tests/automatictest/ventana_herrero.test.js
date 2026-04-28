const { fromRoot } = require("../../utils/path");

// ✅ WRAPPER (no service)
const calcularVentanaHerrero = require(
  fromRoot("wrappers/ventanas/calcularVentanaHerrero"),
);

// =========================
// 🧪 CASOS DE PRUEBA
// =========================
const casos = [
  {
    nombre: "medida estándar completa",
    input: {
      ancho: 120,
      alto: 100,
      color: "blanco",
      guia: true,
      mosquitero: true,
    },
  },
  {
    nombre: "sin guia",
    input: {
      ancho: 120,
      alto: 100,
      color: "blanco",
      guia: false,
      mosquitero: true,
    },
  },
  {
    nombre: "fuera de medida (lookup)",
    input: {
      ancho: 118,
      alto: 97,
      color: "negro",
      guia: true,
      mosquitero: false,
    },
  },
  {
    nombre: "mayor a 240 (divide en 2)",
    input: {
      ancho: 250,
      alto: 100,
      color: "blanco",
      guia: true,
      mosquitero: true,
    },
  },
  {
    nombre: "altura con recargo",
    input: {
      ancho: 120,
      alto: 205,
      color: "blanco",
      guia: false,
      mosquitero: false,
    },
  },
  {
    nombre: "con cortina pvc",
    input: {
      ancho: 120,
      alto: 100,
      color: "blanco",
      guia: true,
      mosquitero: false,
      cortina: "pvc",
    },
  },
];

// =========================
// 🧠 VALIDADOR
// =========================
function validar(resultado, input) {
  const errores = [];

  // total
  if (typeof resultado.total !== "number") {
    errores.push("total inválido");
  }

  // items array
  if (!Array.isArray(resultado.items)) {
    errores.push("items no es array");
  }

  // guia
  if (input.guia) {
    const tiene = resultado.items.some((i) => i.tipo === "guia");
    if (!tiene) errores.push("falta item guia");
  }

  // mosquitero
  if (input.mosquitero) {
    const tiene = resultado.items.some((i) => i.tipo === "mosquitero");
    if (!tiene) errores.push("falta item mosquitero");
  }

  // cortina
  if (input.cortina) {
    const tiene = resultado.items.some((i) => i.tipo === "cortina");
    if (!tiene) errores.push("falta item cortina");
  }

  // suma items coherente
  const sumaItems = resultado.items.reduce(
    (acc, i) => acc + (i.precio || 0),
    0,
  );

  if (resultado.total < sumaItems) {
    errores.push("total menor que suma de items");
  }

  // admin debug
  if (resultado.admin) {
    const { venta, costo, ganancia } = resultado.admin;

    if (venta !== resultado.total) {
      errores.push("venta != total");
    }

    if (ganancia !== venta - costo) {
      errores.push("ganancia incorrecta");
    }

    if (costo <= 0) {
      errores.push("costo inválido");
    }
  }

  return errores;
}

// =========================
// 🚀 RUN TESTS
// =========================
console.log("\n🧪 TEST AUTOMÁTICO - WRAPPER VENTANAS HERRERO\n");

casos.forEach((test, index) => {
  try {
    const resultado = calcularVentanaHerrero(test.input, {
      debug: true,
    });

    const errores = validar(resultado, test.input);

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

console.log("\n✅ FIN TEST\n");
