const { fromRoot } = require("../../utils/path");

const calcularPatagonica = require(
  fromRoot("wrappers/patagonicas/calcularPatagonicaModena"),
);

console.log("\n🧪 TEST WRAPPER PATAGONICAS MODENA\n");

const casos = [
  {
    nombre: "Base 1 raja",
    input: {
      medida: "150x100",
      tipoRaja: 50,
      cantidadRajas: 1,
      tipoVidrio: "4mm",
      color: "blanco",
    },
  },
  {
    nombre: "Con mosquitero",
    input: {
      medida: "150x100",
      tipoRaja: 50,
      cantidadRajas: 1,
      tipoVidrio: "4mm",
      color: "blanco",
      extras: {
        mosquitero: true,
      },
    },
  },
  {
    nombre: "2 rajas con mosquitero",
    input: {
      medida: "150x150",
      tipoRaja: 50,
      cantidadRajas: 2,
      tipoVidrio: "4mm",
      color: "blanco",
      extras: {
        mosquitero: true,
      },
    },
  },
  {
    nombre: "Altura mayor a 150",
    input: {
      medida: "150x160",
      tipoRaja: 50,
      cantidadRajas: 1,
      tipoVidrio: "4mm",
      color: "blanco",
    },
  },
  {
    nombre: "Oscilobatiente",
    input: {
      medida: "150x100",
      tipoRaja: 50,
      cantidadRajas: 1,
      tipoApertura: "oscilobatiente",
      tipoVidrio: "4mm",
      color: "blanco",
    },
  },
  {
    nombre: "ERROR guia + cajon",
    input: {
      medida: "150x100",
      tipoRaja: 50,
      cantidadRajas: 1,
      extras: {
        guia: true,
        cajonBlock: true,
      },
    },
  },
  {
    nombre: "ERROR 2 rajas con ancho chico",
    input: {
      medida: "100x60",
      tipoRaja: 50,
      cantidadRajas: 2,
    },
  },
];

casos.forEach((t, i) => {
  try {
    const r = calcularPatagonica(t.input);

    console.log(`✔️ [${i + 1}] ${t.nombre}`);
    console.log("   👉 total:", r.total);
    console.log("   👉 detalle:", r.detalle);
  } catch (e) {
    console.log(`💥 [${i + 1}] ${t.nombre}`);
    console.log("   👉 ERROR:", e.message);
  }
});

console.log("\n✅ FIN TEST WRAPPER\n");
