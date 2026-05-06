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
    nombre: "bipunto mixto",
    input: {
      ancho: 120,
      alto: 100,
      color: "blanco",
      tipoVidrio: "4mm",
      bipuntos: [{ tipo: "comun" }, { tipo: "llave" }],
    },
  },
  {
    nombre: "2 bipuntos llave",
    input: {
      ancho: 120,
      alto: 100,
      color: "blanco",
      tipoVidrio: "4mm",
      bipuntos: [{ tipo: "llave" }, { tipo: "llave" }],
    },
  },
];

function validar(res) {
  const errores = [];

  if (typeof res.precioVenta !== "number") {
    errores.push("precioVenta inválido");
  }

  if (!Array.isArray(res.items)) {
    errores.push("items inválido");
  }

  return errores;
}

casos.forEach((t, i) => {
  try {
    const r = calcularVentanaModena(t.input);

    const errores = validar(r);

    if (errores.length) {
      console.log(`❌ [${i + 1}] ${t.nombre}`);
      errores.forEach((e) => console.log("   -", e));
    } else {
      console.log(`✔️ [${i + 1}] ${t.nombre}`);
    }
  } catch (err) {
    console.log(`💥 [${i + 1}] ${t.nombre}`);
    console.log("   👉", err.message);
  }
});

console.log("\n✅ FIN TEST WRAPPER\n");
