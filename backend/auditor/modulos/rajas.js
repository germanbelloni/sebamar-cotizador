function auditarRajas(resultado) {
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

    const vidrio = Number(
      resultado.items.find((i) => i.tipo === "vidrio")?.precio || 0,
    );

    const mosquitero = Number(
      resultado.items.find((i) => i.tipo === "mosquitero")?.precio || 0,
    );

    const premarco = Number(
      resultado.items.find((i) => i.tipo === "premarco")?.precio || 0,
    );

    const contramarco = Number(
      resultado.items.find((i) => i.tipo === "contramarco")?.precio || 0,
    );

    const brazo = Number(
      resultado.items.find((i) => i.tipo === "brazo")?.precio || 0,
    );

    const volcable = Number(
      resultado.items.find((i) => i.tipo === "volcable")?.precio || 0,
    );

    const oscilobatiente = Number(
      resultado.items.find((i) => i.tipo === "oscilobatiente")?.precio || 0,
    );

    if (estructura === 0) {
      errores.push("No existe item estructura");
    }

    if (vidrio === 0) {
      advertencias.push("La raja no posee vidrio");
    }

    const esperado = resultado.items.reduce(
      (acc, item) => acc + Number(item.precio || 0),
      0,
    );

    if (Math.round(esperado) === Math.round(resultado.costo)) {
      ok.push("✔ Suma de items");
    } else {
      errores.push(
        `Suma de items incorrecta. Esperado ${esperado}, obtenido ${resultado.costo}`,
      );
    }

    if (mosquitero > 0) ok.push("✔ Mosquitero");
    if (premarco > 0) ok.push("✔ Premarco");
    if (contramarco > 0) ok.push("✔ Contramarco");
    if (brazo > 0) ok.push("✔ Brazo");
    if (volcable > 0) ok.push("✔ Volcable");
    if (oscilobatiente > 0) ok.push("✔ Oscilobatiente");
  }

  // =========================
  // COSTO BASE
  // =========================

  const pasoCostoBase = resultado.audit?.find((p) => p.etapa === "Costo Base");

  if (!pasoCostoBase) {
    errores.push("No existe paso Costo Base");
  } else {
    ok.push("✔ Paso Costo Base");

    if (Number(pasoCostoBase.valorDespues) !== Number(resultado.costoBase)) {
      errores.push("Costo Base incorrecto");
    }
  }

  // =========================
  // COLOR
  // =========================

  const pasoColor = resultado.audit?.find((p) => p.etapa === "Color");

  if (!pasoColor) {
    advertencias.push("No existe paso Color");
  } else {
    ok.push("✔ Paso Color");

    if (
      Number(pasoColor.metadata?.incremento || 0) !==
      Number(pasoColor.valorAplicado)
    ) {
      errores.push("Incremento de color incorrecto");
    }
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
  // =========================
  // AUDITORÍA
  // =========================

  if (!Array.isArray(resultado.audit)) {
    errores.push("No existe audit");
  } else {
    ok.push(`✔ ${resultado.audit.length} pasos`);
  }

  // =========================
  // REGLAS
  // =========================

  if (resultado.precioLista < resultado.precioProveedor) {
    advertencias.push("La lista es menor que el proveedor.");
  }

  if (resultado.precioFinal < resultado.precioLista) {
    advertencias.push("El precio final es menor que la lista.");
  }

  return {
    ok,
    advertencias,
    errores,
    valido: errores.length === 0,
  };
}

module.exports = auditarRajas;
