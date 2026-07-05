const auditarHerrero = require("./patagonicasHerrero");
const auditarModena = require("./patagonicasModena");

function auditarPatagonicas(resultado) {
  if (resultado.linea === "modena") {
    return auditarModena(resultado);
  }

  return auditarHerrero(resultado);
}

module.exports = auditarPatagonicas;
