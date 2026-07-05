function auditarPlacas(resultado) {
  const errores = [];
  const advertencias = [];
  const ok = [];

  if (resultado.costoBase == null) errores.push("Falta costoBase");
  else ok.push("✔ costoBase");

  if (resultado.costo == null) errores.push("Falta costo");
  else ok.push("✔ costo");

  if (resultado.precioProveedor == null) errores.push("Falta precioProveedor");
  else ok.push("✔ precioProveedor");

  if (resultado.precioLista == null) errores.push("Falta precioLista");
  else ok.push("✔ precioLista");

  if (resultado.precioFinal == null) errores.push("Falta precioFinal");
  else ok.push("✔ precioFinal");

  if (!Array.isArray(resultado.items)) {
    errores.push("Items inválidos");
  } else {
    ok.push(`✔ ${resultado.items.length} items`);

    const suma = resultado.items.reduce(
      (acc, i) => acc + Number(i.precio || 0),
      0,
    );

    if (Math.round(suma) === Math.round(resultado.costoBase))
      ok.push("✔ Suma de items");
    else
      errores.push(
        `Suma incorrecta. Esperado ${suma}, obtenido ${resultado.costoBase}`,
      );
  }

  if (!Array.isArray(resultado.audit)) errores.push("No existe audit");
  else ok.push(`✔ ${resultado.audit.length} pasos`);

  const pasoPerfil = resultado.audit?.find((p) => p.etapa === "Perfil");

  if (!pasoPerfil) {
    advertencias.push("No existe paso Perfil");
  } else {
    ok.push("✔ Paso Perfil");

    if (
      Math.round(pasoPerfil.valorDespues) !== Math.round(resultado.precioFinal)
    ) {
      errores.push("Precio final distinto al Perfil");
    }
  }

  if (resultado.precioLista < resultado.precioProveedor)
    advertencias.push("La lista es menor que el proveedor.");

  if (resultado.precioFinal < resultado.precioLista)
    advertencias.push("El precio final es menor que la lista.");

  return {
    ok,
    advertencias,
    errores,
    valido: errores.length === 0,
  };
}

module.exports = auditarPlacas;
