module.exports = function auditarPortones(resultado) {
  const ok = [];
  const advertencias = [];
  const errores = [];

  // =====================
  // COSTOS
  // =====================

  if (resultado.costoBase > 0) {
    ok.push("✔ costoBase");
  } else {
    errores.push("costoBase inválido");
  }

  if (resultado.costo > 0) {
    ok.push("✔ costo");
  } else {
    errores.push("costo inválido");
  }

  if (resultado.precioProveedor > 0) {
    ok.push("✔ precioProveedor");
  } else {
    errores.push("precioProveedor inválido");
  }

  if (resultado.precioLista > 0) {
    ok.push("✔ precioLista");
  } else {
    errores.push("precioLista inválido");
  }

  if (resultado.precioFinal > 0) {
    ok.push("✔ precioFinal");
  } else {
    errores.push("precioFinal inválido");
  }

  // =====================
  // ITEMS
  // =====================

  const items = resultado.items || [];

  ok.push(`✔ ${items.length} items`);

  const estructura = items
    .filter((i) => i.tipo === "estructura")
    .reduce((a, b) => a + Number(b.precio || 0), 0);

  if (estructura > 0) {
    ok.push("✔ Estructura");
  } else {
    errores.push("No existe estructura");
  }

  const vidrio = items
    .filter((i) => i.tipo === "vidrio")
    .reduce((a, b) => a + Number(b.precio || 0), 0);

  ok.push(`✔ Vidrios: ${Math.round(vidrio)}`);

  const sumaItems = items.reduce((a, b) => a + Number(b.precio || 0), 0);

  if (Math.round(sumaItems) === Math.round(resultado.costo)) {
    ok.push("✔ Suma de items");
  } else {
    errores.push(
      `Items incorrectos. Esperado ${Math.round(resultado.costo)}, obtenido ${Math.round(sumaItems)}`,
    );
  }

  // =====================
  // AUDIT
  // =====================

  const audit = resultado.audit || [];

  ok.push(`✔ ${audit.length} pasos`);

  const buscarPaso = (nombre) =>
    audit.find((x) => x.etapa?.toLowerCase() === nombre.toLowerCase());

  if (buscarPaso("Costo Base")) {
    ok.push("✔ Paso Costo Base");
  } else {
    errores.push("Falta paso Costo Base");
  }

  if (buscarPaso("Recargo Alto")) {
    ok.push("✔ Recargo Alto");
  }

  if (buscarPaso("Color")) {
    ok.push("✔ Paso Color");
  }

  if (buscarPaso("Barral Recto")) {
    ok.push("✔ Barral Recto");
  }

  if (buscarPaso("Barral Curvo")) {
    ok.push("✔ Barral Curvo");
  }

  if (buscarPaso("Picaporte")) {
    ok.push("✔ Picaporte");
  }

  if (buscarPaso("Media Manija")) {
    ok.push("✔ Media Manija");
  }

  if (buscarPaso("Cartel")) {
    ok.push("✔ Cartel");
  }

  if (buscarPaso("Herraje Corredizo")) {
    ok.push("✔ Herraje Corredizo");
  }

  if (buscarPaso("Herraje Plegadizo")) {
    ok.push("✔ Herraje Plegadizo");
  }

  if (buscarPaso("Doble Travesaño")) {
    ok.push("✔ Doble Travesaño");
  }

  if (buscarPaso("Bisagras Extra")) {
    ok.push("✔ Bisagras Extra");
  }
  const pasoPerfil = buscarPaso("Perfil");

  if (pasoPerfil) {
    ok.push("✔ Paso Perfil");

    const precioEsperado = Number(
      resultado.precioLista || resultado.precioFinal,
    );

    if (Math.round(pasoPerfil.valorDespues) !== Math.round(precioEsperado)) {
      errores.push("Precio final distinto al calculado en Perfil");
    }
  } else {
    errores.push("Falta paso Perfil");
  }

  // =====================
  // CONFIGURACIÓN
  // =====================

  const cfg = resultado.configuracion || {};

  if (!cfg.linea) {
    errores.push("Configuración sin línea");
  }

  if (!cfg.color) {
    errores.push("Configuración sin color");
  }

  if (!cfg.sistema) {
    errores.push("Configuración sin sistema");
  }

  if (!cfg.hojas) {
    errores.push("Configuración sin hojas");
  }

  if (!cfg.ancho) {
    errores.push("Configuración sin ancho");
  }

  if (!cfg.alto) {
    errores.push("Configuración sin alto");
  }

  // =====================
  // REGLAS PROPIAS PORTONES
  // =====================

  if (cfg.hojas && ![3, 4, 5, 6].includes(Number(cfg.hojas))) {
    errores.push("Cantidad de hojas inválida");
  }

  if (cfg.anchoCobrado && ![70, 80, 90].includes(Number(cfg.anchoCobrado))) {
    errores.push(`Ancho cobrado inválido (${cfg.anchoCobrado})`);
  }

  if (
    cfg.sistema &&
    !["abrir", "corredizo", "plegadizo"].includes(cfg.sistema)
  ) {
    errores.push("Sistema inválido");
  }

  if (cfg.sistema === "abrir" && cfg.alto && Number(cfg.alto) > 210) {
    errores.push("Portón de abrir mayor a 210cm");
  }

  // =====================
  // RESULTADO
  // =====================

  return {
    ok,
    advertencias,
    errores,
    valido: errores.length === 0,
  };
};
