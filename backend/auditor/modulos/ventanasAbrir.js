function auditarVentanasAbrir(resultado) {
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

    const vidrio = resultado.items
      .filter((i) => i.tipo === "vidrio")
      .reduce((acc, i) => acc + Number(i.precio || 0), 0);

    const cp8 = resultado.items
      .filter((i) => i.tipo === "cp8")
      .reduce((acc, i) => acc + Number(i.precio || 0), 0);

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

    const cajonBlock = Number(
      resultado.items.find((i) => i.tipo === "cajon_block")?.precio || 0,
    );

    const premarco = Number(
      resultado.items.find((i) => i.tipo === "premarco")?.precio || 0,
    );

    const contramarco = Number(
      resultado.items.find((i) => i.tipo === "contramarco")?.precio || 0,
    );

    if (estructura === 0) {
      errores.push("No existe item estructura");
    }

    if (vidrio === 0) {
      advertencias.push("No posee vidrio");
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

    if (cp8 > 0) ok.push("✔ CP8");
    if (mosquitero > 0) ok.push("✔ Mosquitero");
    if (guia > 0) ok.push("✔ Guía");
    if (cortinaPVC > 0) ok.push("✔ Cortina PVC");
    if (cortinaAluminio > 0) ok.push("✔ Cortina Aluminio");
    if (cajonBlock > 0) ok.push("✔ Cajón Block");
    if (premarco > 0) ok.push("✔ Premarco");
    if (contramarco > 0) ok.push("✔ Contramarco");
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
      errores.push("Costo Base incorrecto");
    }
  }

  // =========================
  // ÚLTIMO PASO DE COSTO
  // =========================

  const pasosCosto = [
    "Color",
    "Mosquitero",
    "Guía",
    "Cortina PVC",
    "Cortina Aluminio",
    "Cajón Block",
    "Premarco",
    "Contramarco",
    "CP8",
  ];

  const ultimoPasoCosto = [...(resultado.audit || [])]
    .reverse()
    .find((p) => pasosCosto.includes(p.etapa));

  if (!ultimoPasoCosto) {
    advertencias.push("No existe paso de costo");
  } else {
    ok.push("✔ Paso Color");

    if (
      Math.round(Number(ultimoPasoCosto.valorDespues)) !==
      Math.round(Number(resultado.costo))
    ) {
      errores.push("El costo final no coincide con el último paso de costo");
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

module.exports = auditarVentanasAbrir;
