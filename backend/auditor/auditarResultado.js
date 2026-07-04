const modulos = require("./modulos");

function auditarResultado(resultado) {
  const modulo = resultado.modulo;

  const auditor = modulos[modulo];

  if (!auditor) {
    return {
      valido: false,
      errores: [`No existe auditor para el módulo '${modulo}'`],
      advertencias: [],
      ok: [],
    };
  }

  return auditor(resultado);
}

module.exports = auditarResultado;
