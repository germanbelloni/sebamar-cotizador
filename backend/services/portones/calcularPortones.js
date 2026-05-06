const { fromRoot } = require("../../utils/path");

const calcularPuertas = require(fromRoot("services/puertas/calcularPuertas"));

function calcularPortones(dataInput) {
  const { ancho, alto, hojas, ...rest } = dataInput;

  let costoBase = 0;
  const items = [];

  const anchoHoja = ancho / hojas;

  for (let i = 0; i < hojas; i++) {
    const r = calcularPuertas({
      ...rest,
      medida: `${Math.round(anchoHoja)}x${alto}`,
    });

    costoBase += r.costoBase;
    items.push(...r.items);
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

module.exports = calcularPortones;
