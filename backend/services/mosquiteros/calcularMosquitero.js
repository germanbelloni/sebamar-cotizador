const { fromRoot } = require("../../utils/path");

const mosquiteros = require(
  fromRoot("backend/data/productos/mosquiteros.json"),
);

function calcularMosquitero(dataInput) {
  const { medida } = dataInput;

  const datos = mosquiteros.medidas?.[medida];

  if (!datos) {
    throw new Error(`Medida no encontrada: ${medida}`);
  }

  const base = datos.base || datos.precio || 0;

  return {
    costoBase: Math.round(base),

    items: [
      {
        tipo: "estructura",
        descripcion: medida,
        precio: Math.round(base),
      },
    ],

    configuracion: {
      medida,
    },
  };
}

module.exports = calcularMosquitero;
