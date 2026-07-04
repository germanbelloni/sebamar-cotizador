function explainPrice(audit) {
  if (!audit) {
    return "Sin auditoría.";
  }

  const lineas = [];

  lineas.push("================================");
  lineas.push("AUDITORÍA DE PRECIO");
  lineas.push("================================");

  lineas.push(`Módulo: ${audit.modulo}`);
  lineas.push(`Línea: ${audit.linea}`);
  lineas.push(`Perfil: ${audit.perfil}`);

  lineas.push("");

  lineas.push(`Costo Base............. $${audit.costoBase}`);
  lineas.push(`Costo Final............ $${audit.costoFinal}`);
  lineas.push(`Proveedor.............. $${audit.precioProveedor}`);
  lineas.push(`Lista.................. $${audit.precioLista}`);
  lineas.push(`Precio Final........... $${audit.precioFinal}`);

  lineas.push("");

  lineas.push("PERFIL");

  lineas.push(`Descuento.............. ${audit.descuentoAplicado}%`);
  lineas.push(`Flete................. ${audit.fleteAplicado}%`);
  lineas.push(`Ganancia.............. ${audit.gananciaAplicada}%`);
  lineas.push(`Margen................ ${audit.margenAplicado}%`);

  lineas.push("");

  lineas.push(`Ganancia $............ ${audit.ganancia}`);

  if (audit.pasos?.length) {
    lineas.push("");
    lineas.push("PASOS");

    audit.pasos.forEach((p, i) => {
      lineas.push(
        `${i + 1}. ${p.descripcion} -> ${p.valor >= 0 ? "+" : ""}${p.valor}`,
      );
    });
  }

  lineas.push("");

  return lineas.join("\n");
}

module.exports = explainPrice;
