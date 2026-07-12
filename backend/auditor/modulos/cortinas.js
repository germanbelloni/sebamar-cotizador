function auditarCortinas(resultado) {
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

    const estructura = Number(
      resultado.items.find((i) => i.tipo === "estructura")?.precio || 0,
    );

    if (estructura === 0) {
      errores.push("No existe item estructura");
    }

    const esperado = resultado.items.reduce(
      (acc, item) => acc + Number(item.precio || 0),
      0,
    );

    if (Math.round(esperado) === Math.round(resultado.costoBase)) {
      ok.push("✔ Suma de items");
    } else {
      errores.push(
        `Items incorrectos. Esperado ${esperado}, obtenido ${resultado.costoBase}`,
      );
    }
  }

  // =========================
  // IVA
  // =========================

  const pasoIva = resultado.audit?.find((p) => p.etapa === "IVA");

  if (!pasoIva) {
    errores.push("No existe paso IVA");
  } else {
    ok.push("✔ Paso IVA");
  }

  // =========================
  // PERFIL
  // =========================

  const pasoPerfil = resultado.audit?.find((p) => p.etapa === "Perfil");

  if (!pasoPerfil) {
    errores.push("No existe paso Perfil");
  } else {
    ok.push("✔ Paso Perfil");

    if (
      Math.round(pasoPerfil.valorDespues) !== Math.round(resultado.precioFinal)
    ) {
      errores.push("Precio final distinto al calculado en Perfil");
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

  return {
    ok,
    advertencias,
    errores,
    valido: errores.length === 0,
  };
}

module.exports = auditarCortinas;
