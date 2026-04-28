const { fromRoot } = require("../../utils/path");

const calcularPatagonicaModena = require(
  fromRoot("backend/services/patagonicas/calcularPatagonicaModena"),
);

console.log("\n🧪 TEST SERVICE PATAGONICAS MODENA\n");

const casos = [
  {
    nombre: "Base 1 raja",
    input: {
      tipo: "1_raja",
      medida: "150x100",
      color: "blanco",
      tipoVidrio: "4mm",
    },
  },
  {
    nombre: "Color negro",
    input: {
      tipo: "1_raja",
      medida: "150x100",
      color: "negro",
      tipoVidrio: "4mm",
    },
  },
  {
    nombre: "Vidrio 3+3",
    input: {
      tipo: "1_raja",
      medida: "150x100",
      tipoVidrio: "3+3",
    },
  },
  {
    nombre: "DVH clásico",
    input: {
      tipo: "1_raja",
      medida: "150x100",
      tipoVidrio: "dvh",
    },
  },
  {
    nombre: "DVH 5+9+5",
    input: {
      tipo: "1_raja",
      medida: "150x150",
      tipoVidrio: "dvh_5_9_5",
    },
  },
  {
    nombre: "Laminado 4+4",
    input: {
      tipo: "1_raja",
      medida: "150x150",
      tipoVidrio: "4+4",
    },
  },
  {
    nombre: "Tipo inválido",
    input: {
      tipo: "3_rajas",
      medida: "150x100",
    },
  },
  {
    nombre: "Medida inexistente",
    input: {
      tipo: "1_raja",
      medida: "999x999",
    },
  },
];

casos.forEach((t, i) => {
  try {
    const r = calcularPatagonicaModena(t.input);

    if (!r.total || r.total <= 0) {
      throw new Error("total inválido");
    }

    console.log(`✔️ [${i + 1}] ${t.nombre}`);
    console.log("   👉 total:", r.total);
    console.log("   👉 base:", r.base);
    console.log("   👉 vidrio:", r.vidrio);
  } catch (e) {
    console.log(`💥 [${i + 1}] ${t.nombre}`);
    console.log("   👉 ERROR:", e.message);
  }
});

console.log("\n✅ FIN TEST SERVICE\n");
