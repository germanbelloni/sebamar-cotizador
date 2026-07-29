"use strict";

function borde() {
  return {
    top: { style: "thin", color: { argb: "000000" } },
    bottom: { style: "thin", color: { argb: "000000" } },
    left: { style: "thin", color: { argb: "000000" } },
    right: { style: "thin", color: { argb: "000000" } },
  };
}

function renderTabla(ws, inicioFila, columnas, datos, tema, campos) {
  const header = ws.getRow(inicioFila);

  columnas.forEach((texto, index) => {
    const cell = header.getCell(index + 1);
    cell.value = texto;
    cell.font = {
      name: "Arial",
      bold: true,
      size: 9,
      color: { argb: tema.textColor },
    };
    cell.alignment = {
      horizontal: "center",
      vertical: "middle",
      wrapText: true,
    };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: tema.headerColor },
    };
    cell.border = borde();
  });
  header.height = 20;

  let fila = inicioFila + 1;
  for (const item of datos) {
    const valores = campos.map((campo) => item[campo]);

    valores.forEach((valor, columna) => {
      const cell = ws.getCell(fila, columna + 1);
      cell.value = valor;
      cell.font = { name: "Arial", size: 8.5, bold: columna === 0 };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = borde();
      cell.numFmt = columna === 0 ? "@" : "0";
      if (columna === 0) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: tema.headerColor },
        };
      }
    });
    ws.getRow(fila).height = 13;
    fila += 1;
  }

  return fila;
}

module.exports = renderTabla;
