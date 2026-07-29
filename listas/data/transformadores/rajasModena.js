"use strict";

const { aplicarPerfil } = require("../../motor/aplicarPerfil");

function transformarRajasModena(filasCatalogo, perfil) {
  const filas = filasCatalogo.map((fila) => {
    const medida = String(fila.MEDIDA || "").trim();

    const base = Number(fila.BASE);
    const vidrio3 = Number(fila["3MM"]);
    const vidrio4 = Number(fila["4MM"]);
    const vidrio5 = Number(fila["5MM"]);
    const esmerilado = Number(fila.ESMERILADO);
    const fantasia = Number(fila.FANTASIA);
    const vidrio33 = Number(fila["3+3"]);
    const camara = Number(fila.CAMARA);

    if (
      ![
        base,
        vidrio3,
        vidrio4,
        vidrio5,
        esmerilado,
        fantasia,
        vidrio33,
        camara,
      ].every(Number.isFinite)
    ) {
      throw new Error(`La medida ${medida} tiene datos invalidos.`);
    }

    return {
      medida,
      "3mm": aplicarPerfil(base + vidrio3, perfil, "modena"),
      "4mm": aplicarPerfil(base + vidrio4, perfil, "modena"),
      "5mm": aplicarPerfil(base + vidrio5, perfil, "modena"),
      esmerilado: aplicarPerfil(base + esmerilado, perfil, "modena"),
      fantasia: aplicarPerfil(base + fantasia, perfil, "modena"),
      "3+3": aplicarPerfil(base + vidrio33, perfil, "modena"),
      dvh: aplicarPerfil(base + vidrio4 * 2 + camara, perfil, "modena"),
    };
  });

  return {
    nombre: "Rajas Modena",
    titulo: "RAJAS MODENA",
    perfil,
    compacta: true,
    diagrama: "rajas",
    columnas: [
      "Medidas",
      "3mm",
      "4mm",
      "5mm",
      "Esmerilado",
      "Fantasia",
      "3+3",
      "DVH",
    ],
    campos: [
      "medida",
      "3mm",
      "4mm",
      "5mm",
      "esmerilado",
      "fantasia",
      "3+3",
      "dvh",
    ],
    columnWidths: [
      { width: 16 }, // Medidas
      { width: 12 }, // 3mm
      { width: 12 }, // 4mm
      { width: 12 }, // 5mm
      { width: 14 }, // Esmerilado
      { width: 12 }, // Fantasia
      { width: 12 }, // 3+3
      { width: 12 }, // DVH
    ],
    filas,
  };
}

module.exports = transformarRajasModena;
