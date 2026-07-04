const Auditor = require("./Auditor");
const ReportPrinter = require("./ReportPrinter");

function auditarModulo(nombre, tests = []) {
  const auditor = new Auditor(nombre);

  for (const test of tests) {
    try {
      test(auditor);
    } catch (error) {
      auditor.errorTest(test.name || "Test", "Sin excepción", error.message);
    }
  }

  const resumen = auditor.getResumen();

  ReportPrinter.print(resumen);

  return resumen;
}

module.exports = auditarModulo;
