function auditarPuertas(resultado) {
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

    if (estructura === 0) {
      errores.push("No existe estructura");
    } else {
      ok.push("✔ Estructura");
    }

    const vidrios = resultado.items
      .filter((i) => i.tipo === "vidrio")
      .reduce((acc, i) => acc + Number(i.precio || 0), 0);

    ok.push(`✔ Vidrios: ${vidrios}`);

    const sumaItems = resultado.items.reduce(
      (acc, item) => acc + Number(item.precio || 0),
      0,
    );

    const color = resultado.items
      .filter((i) => i.tipo === "color")
      .reduce((acc, i) => acc + Number(i.precio || 0), 0);

    const extras = resultado.items
      .filter((i) => !["estructura", "vidrio", "color"].includes(i.tipo))
      .reduce((acc, i) => acc + Number(i.precio || 0), 0);

    const esperado = Math.round(resultado.costoBase + color + extras);

    if (Math.round(sumaItems) === esperado) {
      ok.push("✔ Suma de items");
    } else {
      errores.push(
        `Items incorrectos. Esperado ${esperado}, obtenido ${Math.round(
          sumaItems,
        )}`,
      );
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
  } else {
    ok.push("✔ Paso Costo Base");

    if (Math.round(pasoBase.valorDespues) !== Math.round(resultado.costoBase)) {
      errores.push("Costo Base distinto al calculado");
    }
  }

  // =========================
  // RECARGO ALTURA
  // =========================

  const hayRecargo = resultado.audit?.some((p) => p.etapa === "Recargo Alto");

  if (hayRecargo) {
    ok.push("✔ Recargo Alto");
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

  // =========================
  // REGLAS
  // =========================

  if (resultado.precioProveedor > resultado.costo) {
    advertencias.push("El proveedor es mayor que el costo.");
  }

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

module.exports = auditarPuertas;
