"use strict";

const { aplicarPerfil } = require("../../motor/aplicarPerfil");

function transformarFila(fila, perfil) {
  const medida = String(fila.MEDIDA || "").trim();

  const base = Number(fila.BASE);
  const vidrio4 = Number(fila.VIDRIO_4MM);
  const vidrio33 = Number(fila["VIDRIO_3+3"]);
  const camara = Number(fila.CAMARA);

  if (![base, vidrio4, vidrio33, camara].every(Number.isFinite)) {
    throw new Error(`La medida ${medida} tiene datos invalidos.`);
  }

  return {
    medida,
    "4mm": aplicarPerfil(base + vidrio4, perfil, "modena"),
    dvh: aplicarPerfil(base + vidrio4 * 2 + camara, perfil, "modena"),
    "3+3": aplicarPerfil(base + vidrio33, perfil, "modena"),
  };
}

function transformarPatagonicasModena(filasCatalogo, perfil) {
  const unaRaja = filasCatalogo.filter(
    (fila) =>
      String(fila.TIPO || "")
        .trim()
        .toUpperCase() === "1_RAJA",
  );

  const dosRajas = filasCatalogo.filter(
    (fila) =>
      String(fila.TIPO || "")
        .trim()
        .toUpperCase() === "2_RAJA",
  );

  return {
    nombre: "Patagonicas Modena",
    titulo: "PATAGONICAS MODENA",
    perfil,
    compacta: true,

    columnas: ["Medidas", "4mm", "DVH", "3+3"],
    campos: ["medida", "4mm", "dvh", "3+3"],
    columnWidths: [{ width: 16 }, { width: 16 }, { width: 16 }, { width: 16 }],

    filas: unaRaja.map((fila) => transformarFila(fila, perfil)),

    secciones: [
      {
        titulo: "c/ 2 Rajas + pf 100",
        filas: dosRajas.map((fila) => transformarFila(fila, perfil)),
      },
    ],
  };
}

module.exports = transformarPatagonicasModena;
