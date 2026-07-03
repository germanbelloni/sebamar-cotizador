function necesitaDobleTravesano({ sistema, hojas, modelo }) {
  if (sistema !== "abrir") {
    return false;
  }

  if (hojas >= 4) {
    return true;
  }

  return ["modelo_4", "modelo_4_vr", "modelo_5"].includes(modelo);
}

function necesitaBisagrasExtra({ sistema, hojas }) {
  return sistema === "abrir" && hojas >= 4;
}

module.exports = {
  necesitaDobleTravesano,
  necesitaBisagrasExtra,
};
