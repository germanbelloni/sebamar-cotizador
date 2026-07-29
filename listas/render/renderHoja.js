"use strict";

const path = require("path");
const layout = require("../config/layout");
const temas = require("../config/temas");
const renderTabla = require("./renderTabla");

const LOGO_PATH = path.resolve(
  __dirname,
  "../../frontend/public/logos/sebamar.png",
);

async function renderHoja(workbook, hoja) {
  const ws = workbook.addWorksheet(hoja.nombre);
  const tema = temas[hoja.perfil];

  if (!tema) {
    throw new Error(`No existe un tema visual para el perfil '${hoja.perfil}'.`);
  }

  const totalColumnas = hoja.columnas.length;
  const ultimaColumna = String.fromCharCode(64 + totalColumnas);
  ws.pageSetup = { ...layout.pageSetup, printArea: `A1:${ultimaColumna}${hoja.filas.length + 8}` };
  ws.views = [{ showGridLines: layout.showGridLines }];
  ws.columns = hoja.columnWidths || layout.columns;
  ws.properties.defaultRowHeight = 13;

  const logoId = workbook.addImage({ filename: LOGO_PATH, extension: "png" });
  ws.addImage(logoId, { tl: { col: 1.2, row: 0.15 }, ext: { width: 235, height: 69 } });
  ws.getRow(1).height = 38;
  ws.getRow(2).height = 14;
  ws.getRow(3).height = 14;

  ws.mergeCells(`A4:${ultimaColumna}4`);
  const titulo = ws.getCell("A4");
  titulo.value = hoja.titulo;
  titulo.font = { name: "Arial", bold: true, italic: true, size: 13, color: { argb: tema.textColor } };
  titulo.alignment = { horizontal: "center", vertical: "middle" };
  titulo.fill = { type: "pattern", pattern: "solid", fgColor: { argb: tema.headerColor } };
  titulo.border = {
    top: { style: "medium", color: { argb: "000000" } },
    bottom: { style: "medium", color: { argb: "000000" } },
    left: { style: "medium", color: { argb: "000000" } },
    right: { style: "medium", color: { argb: "000000" } },
  };
  ws.getRow(4).height = 23;

  renderTabla(ws, 5, hoja.columnas, hoja.filas, tema, hoja.campos);
  ws.pageSetup.printTitlesRow = "1:5";
  return ws;
}

module.exports = renderHoja;
