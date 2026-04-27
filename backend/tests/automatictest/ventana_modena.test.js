const { fromRoot } = require("../../utils/path");

const calcularVentanaModena = require(
  fromRoot("wrappers/ventanas/calcularVentanaModena"),
);

console.log("\n🧪 TEST WRAPPER MODENA\n");

// =========================
// CASOS
// =========================
const casos = [
  {
    nombre: "base",
    input: {
      ancho: 120,
      alto: 100,
      color: "blanco",
      tipoVidrio: "4mm",
    },
  },
  {
    nombre: "con guia",
    input: {
      ancho: 120,
      alto: 100,
      color: "blanco",
      guia: true,
      tipoVidrio: "4mm",
    },
  },
  {
    nombre: "con mosquitero",
    input: {
      ancho: 120,
      alto: 100,
      color: "blanco",
      mosquitero: true,
      tipoVidrio: "4mm",
    },
  },
  {
    nombre: "bipunto x2",
    input: {
      ancho: 120,
      alto: 100,
      color: "blanco",
      tipoVidrio: "4mm",
      bipunto: true,
      bipuntoCantidad: 2,
    },
  },
  {
    nombre: "altura con recargo",
    input: {
      ancho: 120,
      alto: 205,
      color: "blanco",
      tipoVidrio: "4mm",
    },
  },
  {
    nombre: "mayor a 240 divide",
    input: {
      ancho: 250,
      alto: 100,
      color: "blanco",
      tipoVidrio: "4mm",
    },
  },
];

// =========================
// VALIDADOR
// =========================
function validar(res, input) {
  const errores = [];

  if (!res) errores.push("sin respuesta");

  if (typeof res.total !== "number") {
    errores.push("total inválido");
  }

  if (!Array.isArray(res.items)) {
    errores.push("items no es array");
  }

  if (input.guia) {
    const ok = res.items.some((i) => i.tipo === "guia");
    if (!ok) errores.push("falta guia");
  }

  if (input.mosquitero) {
    const ok = res.items.some((i) => i.tipo === "mosquitero");
    if (!ok) errores.push("falta mosquitero");
  }

  if (input.bipunto) {
    const ok = res.items.some((i) => i.tipo === "bipunto");
    if (!ok) errores.push("falta bipunto");
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
    const res = calcularVentanaModena(test.input, { debug: true });

    const errores = validar(res, test.input);

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

console.log("\n✅ FIN TEST WRAPPER\n");
