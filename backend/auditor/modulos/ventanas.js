function auditarVentanas(resultado) {
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

    const guia = Number(
      resultado.items.find((i) => i.tipo === "guia")?.precio || 0,
    );

    const cortinaPVC = Number(
      resultado.items.find((i) => i.tipo === "cortina_pvc")?.precio || 0,
    );

    const cortinaAluminio = Number(
      resultado.items.find((i) => i.tipo === "cortina_aluminio")?.precio || 0,
    );

    if (estructura === 0) {
      errores.push("No existe item estructura");
    }

    if (vidrio === 0) {
      advertencias.push("La ventana no posee vidrio");
    }

    const costoCalculado =
      estructura + vidrio + mosquitero + guia + cortinaPVC + cortinaAluminio;

    if (costoCalculado !== Number(resultado.costoBase)) {
      errores.push(
        `Costo Base incorrecto. Esperado ${costoCalculado}, obtenido ${resultado.costoBase}`,
      );
    } else {
      ok.push("✔ Costo Base correcto");
    }

    if (mosquitero > 0) {
      ok.push("✔ Mosquitero");
    }

    if (guia > 0) {
      ok.push("✔ Guía");
    }

    if (cortinaPVC > 0) {
      ok.push("✔ Cortina PVC");
    }

    if (cortinaAluminio > 0) {
      ok.push("✔ Cortina Aluminio");
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

    if (Number(pasoColor.valorDespues) !== Number(resultado.costo)) {
      errores.push("El costo final no coincide con el paso Color");
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
  // REGLAS
  // =========================

  if (resultado.precioProveedor > resultado.costo) {
    advertencias.push(
      "El proveedor es mayor que el costo. Revisar descuentos.",
    );
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

module.exports = auditarVentanas;
