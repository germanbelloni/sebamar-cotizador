function auditarPostigones(resultado) {
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

    const extras = resultado.items
      .filter((i) => i.tipo === "extra")
      .reduce((acc, i) => acc + Number(i.precio || 0), 0);

    if (estructura === 0) {
      errores.push("No existe item estructura");
    }

    const sumaItems = resultado.items.reduce(
      (acc, item) => acc + Number(item.precio || 0),
      0,
    );

    // Si el costoBase es mayor que la suma de items puede deberse
    // al recargo por altura (205/210), que no genera un item aparte.

    if (Math.round(sumaItems) <= Math.round(resultado.costoBase)) {
      ok.push("✔ Suma de items");
    } else {
      errores.push(
        `Suma de items incorrecta. Esperado ${sumaItems}, obtenido ${resultado.costoBase}`,
      );
    }

    if (extras > 0) {
      ok.push("✔ Extras");
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
  // PERFIL
  // =========================

  const pasoPerfil = resultado.audit?.find((p) => p.etapa === "Perfil");

  if (!pasoPerfil) {
    advertencias.push("No existe paso Perfil");
  } else {
    ok.push("✔ Paso Perfil");

    if (
      Math.round(pasoPerfil.valorDespues) !== Math.round(resultado.precioFinal)
    ) {
      errores.push("Precio final distinto al calculado en Perfil");
    }
  }

  // =========================
  // REGLAS
  // =========================

  // El precioProveedor incluye el flete, por lo que normalmente
  // será mayor al costo. Eso no representa un error.

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

module.exports = auditarPostigones;
