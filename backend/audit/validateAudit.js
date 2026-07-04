function validateAudit(audit) {
  if (!audit) {
    throw new Error("Audit inexistente");
  }

  const requiredFields = [
    "modulo",
    "linea",
    "perfil",
    "costoBase",
    "costoFinal",
    "precioProveedor",
    "precioLista",
    "precioFinal",
    "descuentoAplicado",
    "fleteAplicado",
    "gananciaAplicada",
    "margenAplicado",
    "ganancia",
    "pasos",
  ];

  for (const field of requiredFields) {
    if (!(field in audit)) {
      throw new Error(`Audit inválido. Falta '${field}'`);
    }
  }

  if (!Array.isArray(audit.pasos)) {
    throw new Error("Audit inválido. 'pasos' debe ser un array");
  }

  return true;
}

module.exports = validateAudit;
