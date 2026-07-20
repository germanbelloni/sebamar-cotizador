const { fromRoot } = require("../../utils/path");

const calcularPuertas = require(fromRoot("services/puertas/calcularPuertas"));

function normalizarAnchoHoja(anchoHoja) {
  if (anchoHoja < 60 || anchoHoja > 90) {
    throw new Error("Ancho por hoja inválido");
  }

  if (anchoHoja <= 70) return 70;
  if (anchoHoja <= 80) return 80;
  return 90;
}

function validarHojas(ancho, hojas) {
  if (![3, 4, 5, 6].includes(Number(hojas))) {
    throw new Error("Cantidad de hojas inválida");
  }

  const anchoHoja = ancho / hojas;

  if (anchoHoja < 60 || anchoHoja > 90) {
    throw new Error(
      `Configuración inválida: ${hojas} hojas para ancho ${ancho}`,
    );
  }

  return anchoHoja;
}

function calcularPortones(dataInput) {
  const { ancho, alto, hojas, configuracion = "simple", ...rest } = dataInput;

  if (!ancho || !alto || !hojas) {
    throw new Error("Faltan datos");
  }

  const anchoHojaReal = validarHojas(ancho, hojas);
  const anchoCobrado = normalizarAnchoHoja(anchoHojaReal);

  let costoBase = 0;
  const items = [];

  for (let i = 0; i < hojas; i++) {
    const r = calcularPuertas({
      ...rest,
      configuracion,
      ancho: anchoCobrado,
      alto,
      medida: `${anchoCobrado}x${alto}`,
    });
    const estructura = (r.items || []).find((x) => x.tipo === "estructura");
    const vidrio = (r.items || []).find((x) => x.tipo === "vidrio");

    console.log(`
====================================
HOJA ${i + 1}
====================================
Ancho cobrado : ${anchoCobrado}
Alto          : ${alto}
Medida        : ${anchoCobrado}x${alto}

Estructura    : ${estructura?.descripcion || "-"}
Costo estruct.: ${estructura?.precio || 0}

Vidrio        : ${vidrio?.descripcion || "-"}
Costo vidrio  : ${vidrio?.precio || 0}

Subtotal hoja : ${r.costoBase}
====================================
`);
    costoBase += Number(r.costoBase || 0);
    items.push(...(r.items || []));
  }
  console.log(`
====================================
RESUMEN PORTÓN
====================================
Hojas            : ${hojas}
Ancho total      : ${ancho}
Ancho hoja real  : ${anchoHojaReal}
Ancho cobrado    : ${anchoCobrado}

Costo Base Total : ${Math.round(costoBase)}
====================================
`);
  return {
    costoBase: Math.round(costoBase),
    precioVenta: Math.round(costoBase),
    items,
    descripcionBase: "Portón",
    configuracion: {
      hojas,
      ancho,
      alto,
      anchoHojaReal,
      anchoCobrado,
    },
  };
}

module.exports = calcularPortones;
