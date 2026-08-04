function buscarMedidaInferior(medidas, medida) {
  // =========================
  // Búsqueda exacta
  // =========================

  if (medidas?.[medida]) {
    return {
      medida,
      datos: medidas[medida],
    };
  }

  const [ancho, alto] = medida.split("x").map(Number);

  // =========================
  // Compatibilidad formato viejo
  // =========================

  if (alto < 100) {
    const medidaVieja = `${ancho}x0,${alto}`;

    if (medidas?.[medidaVieja]) {
      return {
        medida: medidaVieja,
        datos: medidas[medidaVieja],
      };
    }
  }

  // =========================
  // Buscar medida inferior
  // =========================

  const medidaInferior = Object.keys(medidas)
    .map((m) => {
      const [wStr, hStr] = m.split("x");

      const w = Number(wStr);

      const hNumero = Number(hStr.replace(",", "."));

      const h = hNumero < 1 ? hNumero * 100 : hNumero;

      return {
        key: m,
        w,
        h,
      };
    })
    .filter((m) => m.w === ancho && m.h <= alto)
    .sort((a, b) => b.h - a.h)[0];

  if (!medidaInferior) {
    return null;
  }

  return {
    medida: medidaInferior.key,
    datos: medidas[medidaInferior.key],
  };
}

module.exports = buscarMedidaInferior;
