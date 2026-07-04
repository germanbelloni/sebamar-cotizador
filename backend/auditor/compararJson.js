const Auditor = require("./Auditor");

function compararNumero(auditor, nombre, esperado, obtenido) {
  esperado = Number(esperado || 0);
  obtenido = Number(obtenido || 0);

  if (esperado === obtenido) {
    auditor.okTest(nombre);
    return;
  }

  auditor.errorTest(nombre, esperado, obtenido);
}

function compararJson(json, resultado) {
  const auditor = new Auditor("Comparación contra JSON");

  compararNumero(auditor, "Costo Base", json.costoBase, resultado.costoBase);

  compararNumero(
    auditor,
    "Precio Proveedor",
    json.precioProveedor,
    resultado.precioProveedor,
  );

  compararNumero(
    auditor,
    "Precio Lista",
    json.precioLista,
    resultado.precioLista,
  );

  compararNumero(
    auditor,
    "Precio Final",
    json.precioFinal,
    resultado.precioFinal,
  );

  return auditor.getResumen();
}

module.exports = compararJson;
