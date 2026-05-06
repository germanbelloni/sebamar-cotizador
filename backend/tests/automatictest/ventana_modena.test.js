// =========================
// 🧪 TEST WRAPPER VENTANA MODENA
// =========================

const { fromRoot } = require("../../utils/path");

const calcularVentanaModena = require(
  fromRoot("wrappers/ventanas/calcularVentanaModena"),
);

console.log("\n🧪 TEST WRAPPER VENTANA MODENA\n");

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
    nombre: "completa negra",
    input: {
      ancho: 200,
      alto: 150,
      color: "negro",
      tipoVidrio: "dvh",
      mosquitero: true,
      premarco: true,
      contramarco: true,
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

  if (input.mosquitero) {
    const tiene = res.items.some((i) => i.tipo === "mosquitero");

    if (!tiene) {
      errores.push("falta mosquitero");
    }
  }

  if (input.premarco) {
    const tiene = res.items.some((i) => i.tipo === "premarco");

    if (!tiene) {
      errores.push("falta premarco");
    }
  }

  if (input.contramarco) {
    const tiene = res.items.some((i) => i.tipo === "contramarco");

    if (!tiene) {
      errores.push("falta contramarco");
    }
  }

  if (!res.configuracion?.svg) {
    errores.push("falta svg");
  }

  return errores;
}

casos.forEach((t, i) => {
  try {
    const r = calcularVentanaModena(t.input);

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
