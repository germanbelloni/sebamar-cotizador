// backend/tests/automatictest/mosquiteros.test.js

const { fromRoot } = require(
  "../../utils/path",
);

const calcularMosquiteroVentana =
  require(
    fromRoot(
      "wrappers/mosquiteros/calcularMosquiteroVentana",
    ),
  );

console.log(
  "\n🧪 TEST WRAPPER MOSQUITEROS\n",
);

// =========================
// 🧪 CASOS
// =========================

const casos = [
  {
    nombre: "base",

    input: {
      ancho: 100,

      alto: 100,
    },
  },

  {
    nombre: "negro",

    input: {
      ancho: 120,

      alto: 120,

      color: "negro",
    },
  },

  {
    nombre:
      "simil madera",

    input: {
      ancho: 150,

      alto: 120,

      color:
        "simil madera",
    },
  },
];

// =========================
// 🚀 TEST
// =========================

casos.forEach((test, i) => {
  try {
    const result =
      calcularMosquiteroVentana(
        test.input,
      );

    // =========================
    // ✅ VALIDACIONES
    // =========================

    if (
      !result ||
      typeof result !==
        "object"
    ) {
      throw new Error(
        "response inválida",
      );
    }

    if (
      !result.costoBase ||
      result.costoBase <= 0
    ) {
      throw new Error(
        "costoBase inválido",
      );
    }

    if (
      !result.precioVenta ||
      result.precioVenta <= 0
    ) {
      throw new Error(
        "precioVenta inválido",
      );
    }

    if (
      !Array.isArray(
        result.items,
      )
    ) {
      throw new Error(
        "items inválidos",
      );
    }

    console.log(
      `✔️ [${i + 1}] ${test.nombre}`,
    );

    console.log(
      "   👉 costoBase:",
      result.costoBase,
    );

    console.log(
      "   👉 precioVenta:",
      result.precioVenta,
    );

    console.log(
      "   👉 items:",
      result.items.length,
    );
  } catch (error) {
    console.log(
      `💥 [${i + 1}] ${test.nombre}`,
    );

    console.log(
      "   👉",
      error.message,
    );
  }
});

console.log(
  "\n✅ FIN TEST WRAPPER\n",
);