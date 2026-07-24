function buscarMedidaSuperior(medidas, medida) {
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
  // Buscar medida superior
  // =========================

  const medidaSuperior = Object.keys(medidas)
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
    .filter((m) => m.w >= ancho && m.h >= alto)
    .sort((a, b) => {
      if (a.h !== b.h) {
        return a.h - b.h;
      }

      return a.w - b.w;
    })[0];

  if (!medidaSuperior) {
    return null;
  }
  return {
    medida: medidaSuperior.key,
    datos: medidas[medidaSuperior.key],
  };
}

module.exports = buscarMedidaSuperior;
