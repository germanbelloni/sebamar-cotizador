const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

async function crearPDF(casos) {
  const outputDir = path.join(__dirname, "output");

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const archivo = path.join(outputDir, "QA-Sebamar.pdf");

  const doc = new PDFDocument({
    margin: 40,
    size: "A4",
  });

  doc.pipe(fs.createWriteStream(archivo));

  doc.fontSize(20).text("QA SEBAMAR", {
    align: "center",
  });

  doc.moveDown();

  doc.fontSize(12).text(`Casos generados: ${casos.length}`);

  doc.addPage();

  for (const caso of casos) {
    doc.fontSize(16).text(caso.id || "");

    doc.fontSize(14).text(caso.modulo || "");

    doc.text("Perfil: " + (caso.perfil || ""));

    doc.moveDown();

    doc.fontSize(13).text("CONFIGURACIÓN");

    for (const [clave, valor] of Object.entries(caso.configuracion || {})) {
      doc.text(`${clave}: ${valor}`);
    }

    doc.moveDown();

    doc.fontSize(13).text("ITEMS");

    for (const item of caso.resultado.items || []) {
      doc.text(`${item.tipo} ..... ${item.precio}`);
    }

    doc.moveDown();

    doc.fontSize(13).text("RESULTADO");

    doc.text(`Costo Base: ${caso.resultado.costoBase}`);
    doc.text(`Costo: ${caso.resultado.costo}`);
    doc.text(`Proveedor: ${caso.resultado.precioProveedor}`);
    doc.text(`Lista: ${caso.resultado.precioLista}`);
    doc.text(`Final: ${caso.resultado.precioFinal}`);

    doc.moveDown();

    doc.fontSize(13).text("AUDITORÍA");

    for (const paso of caso.resultado.audit || []) {
      doc.text(paso.etapa || "");
    }

    doc.moveDown();

    doc.text("☐ Verificado");

    doc.moveDown();

    doc.text("Observaciones:");

    doc.text("________________________________________");
    doc.text("________________________________________");

    doc.addPage();
  }

  doc.end();
}

module.exports = crearPDF;
