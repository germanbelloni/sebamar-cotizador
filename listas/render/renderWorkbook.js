const ExcelJS = require("exceljs");
const path = require("path");

const renderHoja = require("./renderHoja");

async function renderWorkbook({ hojas, output }) {
  const workbook = new ExcelJS.Workbook();

  workbook.creator = "Sebamar";
  workbook.company = "Sebamar";
  workbook.title = "Lista Comercial";
  workbook.subject = "Lista Comercial";
  workbook.created = new Date();

  for (const hoja of hojas) {
    await renderHoja(workbook, hoja);
  }

  await workbook.xlsx.writeFile(path.resolve(output));

  return output;
}

module.exports = renderWorkbook;
