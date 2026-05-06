const { fromRoot } = require("../../utils/path");

const data = require(fromRoot("frontend/data/productos/postigones.json"));

function calcularPostigon(dataInput) {
  const { medida, tipo } = dataInput;

  const datos = data.medidas?.[medida];

  if (!datos) {
    throw new Error("Medida no encontrada");
  }

  let base = 0;

  if (tipo === "corredizo") {
    base = datos.corredizo || 0;
  } else if (tipo === "abrir") {
    base = datos.de_abrir || 0;
  } else {
    throw new Error("Tipo inválido");
  }

  const items = [
    {
      tipo: "base",
      descripcion: `${tipo} ${medida}`,
      precio: base,
      costo: base,
    },
  ];

  return {
    costoBase: base,
    items,
    configuracion: {
      hojasBase: datos.hojas || 2,
      tipo,
      medida,
    },
  };
}

module.exports = calcularPostigon;
