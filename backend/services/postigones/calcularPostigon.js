const { fromRoot } = require("../../utils/path");

const data = require(fromRoot("frontend/data/productos/postigones.json"));

// =========================
// 🚀 SERVICE
// =========================

function calcularPostigon(dataInput) {
  const { medida, tipo } = dataInput;

  const datos = data.medidas?.[medida];

  if (!datos) {
    throw new Error("Medida no encontrada");
  }

  let estructura = 0;

  if (tipo === "corredizo") {
    estructura = datos.corredizo || 0;
  } else if (tipo === "abrir") {
    estructura = datos.de_abrir || 0;
  } else {
    throw new Error("Tipo inválido");
  }

  const items = [
    {
      tipo: "estructura",
      descripcion: `${tipo} ${medida}`,
      precio: Math.round(estructura),
    },
  ];

  return {
    costoBase: Math.round(estructura),

    items,

    configuracion: {
      hojasBase: datos.hojas || 2,

      tipo,

      medida,
    },
  };
}

module.exports = calcularPostigon;
