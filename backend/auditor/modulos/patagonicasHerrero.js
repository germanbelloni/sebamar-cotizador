function auditarPatagonicas(resultado) {
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

    const rajas = resultado.items.filter((i) => i.tipo === "raja");

    const panoFijo = resultado.items.find((i) => i.tipo === "pano_fijo");

    if (rajas.length === 0) {
      errores.push("No existe ninguna raja");
    } else {
      ok.push(`✔ ${rajas.length} raja(s)`);
    }

    if (!panoFijo) {
      errores.push("No existe paño fijo");
    } else {
      ok.push("✔ Paño fijo");
    }

    const sumaItems = resultado.items.reduce(
      (acc, item) => acc + Number(item.precio || 0),
      0,
    );

    if (Math.round(sumaItems) === Math.round(resultado.costoBase)) {
      ok.push("✔ Suma de componentes");
    } else {
      errores.push(
        `CostoBase incorrecto. Items=${Math.round(
          sumaItems,
        )} Resultado=${Math.round(resultado.costoBase)}`,
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
  // LOOKUP
  // =========================

  const pasoLookup = resultado.audit?.find((p) => p.etapa === "Lookup");

  if (!pasoLookup) {
    errores.push("No existe paso Lookup");
  } else {
    ok.push("✔ Paso Lookup");
  }

  // =========================
  // COSTO BASE
  // =========================

  const pasoCostoBase = resultado.audit?.find((p) => p.etapa === "Costo Base");

  if (!pasoCostoBase) {
    errores.push("No existe paso Costo Base");
  } else {
    ok.push("✔ Paso Costo Base");

    if (
      Math.round(pasoCostoBase.valorDespues) !== Math.round(resultado.costoBase)
    ) {
      errores.push("Costo Base distinto al calculado por la auditoría");
    }
  }

  // =========================
  // RAJAS
  // =========================

  const pasoRaja1 = resultado.audit?.find((p) => p.etapa === "Raja 1");

  if (!pasoRaja1) {
    errores.push("No existe paso Raja 1");
  } else {
    ok.push("✔ Raja 1");
  }

  const cantidadEsperada = resultado.configuracion?.cantidadRajas || 1;

  if (cantidadEsperada === 2) {
    const pasoRaja2 = resultado.audit?.find((p) => p.etapa === "Raja 2");

    if (!pasoRaja2) {
      errores.push("No existe paso Raja 2");
    } else {
      ok.push("✔ Raja 2");
    }
  }

  // =========================
  // PAÑO FIJO
  // =========================

  const pasoPano = resultado.audit?.find((p) => p.etapa === "Paño Fijo");

  if (!pasoPano) {
    errores.push("No existe paso Paño Fijo");
  } else {
    ok.push("✔ Paño Fijo");
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

module.exports = auditarPatagonicas;
