function auditarPatagonicasModena(resultado) {
  const errores = [];
  const advertencias = [];
  const ok = [];

  // =========================
  // CAMPOS OBLIGATORIOS
  // =========================

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

  // =========================
  // ITEMS
  // =========================

  if (!Array.isArray(resultado.items)) {
    errores.push("Items inválidos");
  } else {
    ok.push(`✔ ${resultado.items.length} items`);

    const estructura = resultado.items.find((i) => i.tipo === "estructura");

    const vidrio = resultado.items.find((i) => i.tipo === "vidrio");

    if (!estructura) errores.push("No existe estructura");
    else ok.push("✔ Estructura");

    if (!vidrio) errores.push("No existe vidrio");
    else ok.push("✔ Vidrio");

    const suma = resultado.items.reduce(
      (acc, i) => acc + Number(i.precio || 0),
      0,
    );

    if (Math.round(suma) === Math.round(resultado.costoBase))
      ok.push("✔ Suma de componentes");
    else errores.push("CostoBase incorrecto");
  }

  // =========================
  // AUDITORÍA
  // =========================

  if (!Array.isArray(resultado.audit)) errores.push("No existe audit");
  else ok.push(`✔ ${resultado.audit.length} pasos`);

  ["Lookup", "Costo Base", "Color", "Perfil"].forEach((paso) => {
    if (resultado.audit.find((p) => p.etapa === paso))
      ok.push(`✔ Paso ${paso}`);
    else errores.push(`No existe paso ${paso}`);
  });

  // =========================
  // PERFIL
  // =========================

  const pasoPerfil = resultado.audit?.find((p) => p.etapa === "Perfil");

  if (!pasoPerfil) {
    errores.push("No existe paso Perfil");
  } else {
    ok.push("✔ Paso Perfil");

    const precioEsperado = Number(
      resultado.precioLista || resultado.precioFinal,
    );

    if (Math.round(pasoPerfil.valorDespues) !== Math.round(precioEsperado)) {
      errores.push("Precio final distinto al calculado en Perfil");
    }
  }
  return {
    ok,
    advertencias,
    errores,
    valido: errores.length === 0,
  };
}

module.exports = auditarPatagonicasModena;
