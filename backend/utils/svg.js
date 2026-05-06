function buildPatagonicaSVG({
  cantidadRajas = 1,
  ladoApertura = "derecha",
  tipoApertura = "abrir",
}) {
  if (cantidadRajas === 2) {
    return {
      tipo: "patagonica",
      layout: ["bisagra_izq", "pano_fijo", "bisagra_der"],
      apertura: tipoApertura,
      svgKey: `patagonica_2_${tipoApertura}`,
    };
  }

  if (ladoApertura === "izquierda") {
    return {
      tipo: "patagonica",
      layout: ["bisagra_izq", "pano_fijo"],
      apertura: tipoApertura,
      svgKey: `patagonica_izq_${tipoApertura}`,
    };
  }

  return {
    tipo: "patagonica",
    layout: ["pano_fijo", "bisagra_der"],
    apertura: tipoApertura,
    svgKey: `patagonica_der_${tipoApertura}`,
  };
}

module.exports = {
  buildPatagonicaSVG,
};
