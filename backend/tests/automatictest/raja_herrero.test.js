const { fromRoot } = require("../../utils/path");

const calcular = require(fromRoot("wrappers/rajas/calcularRajaHerrero"));

console.log("\n🧪 TEST WRAPPER RAJA HERRERO\n");

const casos = [
  {
    nombre: "base",
    input: {
      ancho: 60,
      alto: 60,
      color: "blanco",
    },
  },
  {
    nombre: "con mosquitero",
    input: {
      ancho: 60,
      alto: 60,
      color: "negro",
      mosquitero: true,
    },
  },
  {
    nombre: "con premarco",
    input: {
      ancho: 60,
      alto: 60,
      color: "simil madera",
      premarco: true,
    },
  },
  {
    nombre: "altura alta",
    input: {
      ancho: 60,
      alto: 160,
      color: "blanco",
    },
  },
];

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
    errores.push("ganancia mal calculada");
  }

  return errores;
}

casos.forEach((t, i) => {
  try {
    const res = calcular(t.input);

    const errores = validar(res);

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
