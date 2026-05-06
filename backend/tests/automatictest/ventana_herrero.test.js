// =========================
// 🧪 TEST WRAPPER VENTANA HERRERO
// =========================

const { fromRoot } = require("../../utils/path");

const calcularVentanaHerrero = require(
  fromRoot("wrappers/ventanas/calcularVentanaHerrero"),
);

console.log("\n🧪 TEST WRAPPER VENTANA HERRERO\n");

const casos = [
  {
    nombre: "base",
    input: {
      ancho: 120,
      alto: 100,
      color: "blanco",
    },
  },

  {
    nombre: "con guia",
    input: {
      ancho: 120,
      alto: 100,
      color: "blanco",
      guia: true,
    },
  },

  {
    nombre: "con mosquitero",
    input: {
      ancho: 120,
      alto: 100,
      color: "negro",
      mosquitero: true,
    },
  },
];

function validar(res, input) {
  const errores = [];

  if (typeof res.precioVenta !== "number") {
    errores.push("precioVenta inválido");
  }

  if (typeof res.costo !== "number") {
    errores.push("costo inválido");
  }

  if (!Array.isArray(res.items)) {
    errores.push("items inválido");
  }

  const tieneEstructura = res.items.some((i) => i.tipo === "estructura");

  if (!tieneEstructura) {
    errores.push("falta estructura");
  }

  const tieneVidrio = res.items.some((i) => i.tipo === "vidrio");

  if (!tieneVidrio) {
    errores.push("falta vidrio");
  }

  if (input.guia) {
    const tiene = res.items.some((i) => i.tipo === "guia");

    if (!tiene) {
      errores.push("falta guia");
    }
  }

  if (input.mosquitero) {
    const tiene = res.items.some((i) => i.tipo === "mosquitero");

    if (!tiene) {
      errores.push("falta mosquitero");
    }
  }

  if (!res.configuracion?.svg) {
    errores.push("falta svg");
  }

  return errores;
}

casos.forEach((t, i) => {
  try {
    const r = calcularVentanaHerrero(t.input);

    const errores = validar(r, t.input);

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
  