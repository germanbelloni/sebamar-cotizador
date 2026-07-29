"use strict";

const { aplicarPerfil } = require("../../motor/aplicarPerfil");

function transformarPostigones(filasCatalogo, perfil) {
  return {
    nombre: "Postigones",
    titulo: "POSTIGONES",
    perfil,
    compacta: true,
    columnas: ["Medidas", "Corredizo", "De abrir", "Hojas"],
    campos: ["medida", "corredizo", "deAbrir", "hojas"],
    columnWidths: [{ width: 16 }, { width: 16 }, { width: 16 }, { width: 10 }],
    filas: filasCatalogo.map((fila) => {
      const medida = String(fila.MEDIDA || "").trim();
      const corredizo = Number(fila.CORREDIZO);
      const deAbrir = Number(fila.DE_ABRIR);
      const hojas = Number(fila.HOJAS);
      if (![corredizo, deAbrir, hojas].every(Number.isFinite)) throw new Error(`La medida ${medida} tiene datos invalidos.`);
      return {
        medida,
        corredizo: aplicarPerfil(corredizo, perfil, "herrero"),
        deAbrir: aplicarPerfil(deAbrir * 1.05, perfil, "herrero"),
        hojas,
      };
    }),
  };
}

module.exports = transformarPostigones;
