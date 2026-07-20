function necesitaDobleTravesano({ sistema, hojas, modelo }) {
  if (sistema !== "abrir") {
    return false;
  }

  if (hojas >= 4) {
    return true;
  }

  return [
    "modelo_4",
    "modelo_4_vr",
    "modelo_5",
    "modelo 4",
    "modelo 4 vr",
    "modelo 5",
  ].includes(modelo);
}

function necesitaBisagrasExtra({ sistema, hojas, modelo }) {
  return necesitaDobleTravesano({
    sistema,
    hojas,
    modelo,
  });
}

module.exports = {
  necesitaDobleTravesano,
  necesitaBisagrasExtra,
};
