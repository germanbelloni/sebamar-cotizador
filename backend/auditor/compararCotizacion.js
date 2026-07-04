const compararJson = require("./compararJson");

function compararCotizacion({ esperado, obtenido, tolerancia = 0 }) {
  const resumen = compararJson(esperado, obtenido);

  // Comparaciones adicionales
  if (esperado.items && obtenido.items) {
    if (esperado.items.length !== obtenido.items.length) {
      resumen.error++;

      resumen.tests.push({
        estado: "error",
        nombre: "Cantidad de items",
        esperado: esperado.items.length,
        obtenido: obtenido.items.length,
        diferencia: obtenido.items.length - esperado.items.length,
      });
    } else {
      resumen.ok++;

      resumen.tests.push({
        estado: "ok",
        nombre: "Cantidad de items",
      });
    }
  }

  // Tolerancia para diferencias pequeñas
  resumen.tests.forEach((t) => {
    if (
      t.estado === "error" &&
      typeof t.diferencia === "number" &&
      Math.abs(t.diferencia) <= tolerancia
    ) {
      t.estado = "warning";

      resumen.warning++;

      resumen.error--;
    }
  });

  return resumen;
}

module.exports = compararCotizacion;
