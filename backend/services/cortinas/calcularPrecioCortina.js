const { fromRoot } = require("../../backend/utils/path");

const superficies = require(
  fromRoot("backend/data/productos/superficies.json"),
);

function calcularM2(ancho, alto) {
  return (Number(ancho) * Number(alto)) / 10000;
}

function resolverMedidasFabricacion({ tipo, material, ancho, alto }) {
  let anchoFinal = Number(ancho);
  let altoFinal = Number(alto);

  if (tipo === "cortina") {
    if (material === "pvc") {
      anchoFinal -= 1;
      altoFinal += 17;
    }

    if (material === "aluminio") {
      anchoFinal += 3;
      altoFinal += 17;
    }
  }

  if (tipo === "cajon_block") {
    anchoFinal += 8;
    altoFinal += 18;
  }

  return {
    anchoFinal,
    altoFinal,
  };
}

module.exports = function calcularPrecioCortina({
  tipo,
  material,
  calidad,
  construccion,
  color = "blanco",
  ancho,
  alto,
}) {
  const { anchoFinal, altoFinal } = resolverMedidasFabricacion({
    tipo,
    material,
    ancho,
    alto,
  });

  const m2 = calcularM2(anchoFinal, altoFinal);
  let precioM2 = 0;

  if (tipo === "varillas") {
    precioM2 = superficies.superficies.varillas;
  } else if (tipo === "cortina") {
    if (material === "pvc") {
      precioM2 =
        superficies.superficies.cortinas_modulo.pvc[calidad][construccion];
    }

    if (material === "aluminio") {
      precioM2 =
        superficies.superficies.cortinas_modulo.aluminio[color][construccion];
    }
  }

  if (tipo === "cajon_block") {
    precioM2 = superficies.superficies.cajon_block_precios[material][color];
  }

  const costoBase = Math.round(Number(precioM2 || 0) * m2);

  return {
    costoBase,
    precioM2,
    m2,
    anchoFinal,
    altoFinal,
  };
};
