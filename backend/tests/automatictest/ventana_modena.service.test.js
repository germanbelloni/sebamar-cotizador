const { fromRoot } = require("../../utils/path");

const calcularVentana = require(
  fromRoot("backend/services/ventanas/calcularVentana"),
);

console.log("\n🧪 TEST SERVICE VENTANA MODENA\n");

const casos = [
  {
    nombre: "base 4mm",
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
      tipoVidrio: "4mm",
      linea: "modena",
    },
  },
];

function validar(res) {
  const errores = [];

  if (!res) errores.push("sin respuesta");

  if (typeof res.costoBase !== "number") {
    errores.push("costoBase inválido");
  }

  if (res.costoBase <= 0) {
    errores.push("costoBase <= 0");
  }

  return errores;
}

casos.forEach((t, i) => {
  try {
    const r = calcularVentana(t.input);

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
