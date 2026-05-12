const { fromRoot } = require("../../utils/path");

const calcularPuertas = require(fromRoot("services/puertas/calcularPuertas"));

function calcularportones(dataInput) {
  const { ancho, alto, hojas, ...rest } = dataInput;

  if (!ancho || !alto || !hojas) {
    throw new Error("Faltan datos");
  }

  let costoBase = 0;

  const items = [];

  const anchoHoja = ancho / hojas;

  for (let i = 0; i < hojas; i++) {
    const r = calcularPuertas({
      ...rest,

      medida: `${Math.round(anchoHoja)}x${alto}`,
    });

    costoBase += Number(r.costoBase || 0);

    items.push(...(r.items || []));
  }

  return {
    costoBase: Math.round(costoBase),

    items,

    descripcionBase: "Portón",

    configuracion: {
      hojas,

      ancho,

      alto,
    },
  };
}

module.exports = calcularportones;
