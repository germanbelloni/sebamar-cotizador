const { fromRoot } = require("../../utils/path");

const calcularSuperficie = require(
  fromRoot("services/superficies/Superficies"),
);

console.log("\n🧪 TEST SERVICE SUPERFICIES\n");

const casos = [
  {
    nombre: "paño fijo base",
    input: {
      tipo: "pano_fijo",
      ancho: 100,
      alto: 100,
      linea: "herrero",
      tipoVidrio: "4mm",
    },
  },
  {
    nombre: "paño fijo negro",
    input: {
      tipo: "pano_fijo",
      ancho: 100,
      alto: 100,
      linea: "herrero",
      tipoVidrio: "4mm",
      color: "negro",
    },
  },
  {
    nombre: "premarco",
    input: {
      tipo: "premarco",
      ancho: 100,
      alto: 100,
    },
  },
  {
    nombre: "contramarco negro",
    input: {
      tipo: "contramarco",
      ancho: 100,
      alto: 100,
      color: "negro",
    },
  },
];

// =========================
// 🧠 VALIDADOR PRO
// =========================
function validar(res, input) {
  const errores = [];

  if (!res) errores.push("sin respuesta");

  if (typeof res.costo !== "number") {
    errores.push("costo inválido");
  }

  if (res.costo <= 0) {
    errores.push("costo <= 0");
  }

  if (!res.detalle) {
    errores.push("sin detalle");
  }

  if (typeof res.detalle?.perfil !== "number") {
    errores.push("detalle.perfil inválido");
  }

  if (typeof res.detalle?.vidrio !== "number") {
    errores.push("detalle.vidrio inválido");
  }

  // =========================
  // REGLAS DE NEGOCIO
  // =========================

  if (input.tipo === "pano_fijo") {
    if (res.detalle.vidrio <= 0) {
      errores.push("paño fijo sin vidrio");
    }
  }

  if (input.tipo === "premarco") {
    if (res.detalle.vidrio !== 0) {
      errores.push("premarco no debería tener vidrio");
    }
  }

  if (input.tipo === "contramarco") {
    if (res.detalle.vidrio !== 0) {
      errores.push("contramarco no debería tener vidrio");
    }
  }

  // =========================
  // CONSISTENCIA
  // =========================

  const suma = res.detalle.perfil + res.detalle.vidrio;

  if (Math.abs(suma - res.costo) > 2) {
    errores.push("costo no coincide con detalle");
  }

  return errores;
}

// =========================
// 🚀 RUN
// =========================
casos.forEach((t, i) => {
  try {
    const r = calcularSuperficie(t.input);

    const errores = validar(r, t.input);

    if (errores.length) {
      console.log(`❌ [${i + 1}] ${t.nombre}`);
      errores.forEach((e) => console.log("   -", e));
    } else {
      console.log(`✔️ [${i + 1}] ${t.nombre}`);
      console.log("   👉 costo:", r.costo);
    }
  } catch (e) {
    console.log(`💥 [${i + 1}] ${t.nombre}`);
    console.log("   👉", e.message);
  }
});

console.log("\n✅ FIN TEST SERVICE\n");
