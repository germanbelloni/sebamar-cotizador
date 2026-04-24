function calcularPuertaMosquitera({ ancho, alto, color }) {
  // 🔒 VALIDACIONES
  if (ancho < 70 || ancho > 100) {
    throw new Error("Ancho fuera de rango (70 - 100)");
  }

  if (alto < 180 || alto > 210) {
    throw new Error("Alto fuera de rango (180 - 210)");
  }

  // 📐 NORMALIZACIÓN ANCHO
  let anchoBase;
  let recargoAncho = 0;

  if (ancho <= 80) {
    anchoBase = 80;
  } else if (ancho <= 90) {
    anchoBase = 90;
  } else {
    anchoBase = 90;
    recargoAncho = 0.1; // +10%
  }

  // 📐 NORMALIZACIÓN ALTO
  let altoBase = 200;
  let recargoAlto = 0;

  if (alto > 200) {
    recargoAlto = 0.1; // +10%
  }

  // 📦 RESULTADO (SIN PRECIO)
  const medidaBase = `${anchoBase}x${altoBase}`;
  //debug
  const debug = {
    recargoAncho,
    recargoAlto,
  };

  const descripcion = `Puerta mosquitera aluminio ${
    color || ""
  } ${ancho}x${alto}`.trim();

  const ajuste = recargoAncho + recargoAlto;

  return {
    medidaBase,
    ajuste,
    descripcion,
  };
}

module.exports = calcularPuertaMosquitera;

//sin precio!! actualizar
