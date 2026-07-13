function auditarMosquiteros(resultado) {
  const errores = [];
  const advertencias = [];
  const ok = [];

  // =========================
  // CAMPOS OBLIGATORIOS
  // =========================

  if (resultado.costoBase == null) {
    errores.push("Falta costoBase");
  } else {
    ok.push("✔ costoBase");
  }

  if (resultado.costo == null) {
    errores.push("Falta costo");
  } else {
    ok.push("✔ costo");
  }

  if (resultado.precioProveedor == null) {
    errores.push("Falta precioProveedor");
  } else {
    ok.push("✔ precioProveedor");
  }

  if (resultado.precioLista == null) {
    errores.push("Falta precioLista");
  } else {
    ok.push("✔ precioLista");
  }

  if (resultado.precioFinal == null) {
    errores.push("Falta precioFinal");
  } else {
    ok.push("✔ precioFinal");
  }

  // =========================
  // ITEMS
  // =========================

  if (!Array.isArray(resultado.items)) {
    errores.push("Items inválidos");
  } else {
    ok.push(`✔ ${resultado.items.length} items`);

    const estructura = resultado.items
      .filter((i) => i.tipo === "estructura")
      .reduce((acc, i) => acc + Number(i.precio || 0), 0);

    const color = resultado.items
      .filter((i) => i.tipo === "color")
      .reduce((acc, i) => acc + Number(i.precio || 0), 0);

    if (estructura === 0) {
      errores.push("No existe item estructura");
    }

    const suma = resultado.items.reduce(
      (acc, item) => acc + Number(item.precio || 0),
      0,
    );

    if (Math.round(suma) === Math.round(resultado.costo)) {
      ok.push("✔ Suma de items");
    } else {
      errores.push(
        `Suma de items incorrecta. Esperado ${Math.round(resultado.costo)}, obtenido ${Math.round(suma)}`,
      );
    }

    if (color > 0) {
      ok.push("✔ Color");
    }
  }

  // =========================
  // AUDITORÍA
  // =========================

  if (!Array.isArray(resultado.audit)) {
    errores.push("No existe audit");
  } else {
    ok.push(`✔ ${resultado.audit.length} pasos`);
  }

  // =========================
  // COSTO BASE
  // =========================

  const pasoBase = resultado.audit?.find((p) => p.etapa === "Costo Base");

  if (!pasoBase) {
    errores.push("No existe paso Costo Base");
  } else if (
    Math.round(pasoBase.valorDespues) === Math.round(resultado.costoBase)
  ) {
    ok.push("✔ Costo Base correcto");
  } else {
    errores.push("Costo Base incorrecto");
  }

  // =========================
  // COLOR
  // =========================

  const pasoColor = resultado.audit?.find((p) => p.etapa === "Color");

  if (!pasoColor) {
    advertencias.push("No existe paso Color");
  } else {
    ok.push("✔ Paso Color");
  }

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

module.exports = auditarMosquiteros;
