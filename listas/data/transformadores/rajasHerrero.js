"use strict";

const { aplicarPerfil } = require("../../motor/aplicarPerfil");

const VIDRIOS = [
  ["3MM", "3mm"],
  ["4MM", "4mm"],
  ["5MM", "5mm"],
  ["ESMERILADO", "esmerilado"],
  ["FANTASIA", "fantasia"],
  ["3+3", "3+3"],
];

function transformarRajasHerrero(filasCatalogo, perfil) {
  const filas = filasCatalogo.map((fila) => {
    const medida = String(fila.MEDIDA || "").trim();
    const base = Number(fila.BASE);

    if (!Number.isFinite(base)) {
      throw new Error(`La medida ${medida} no tiene un valor BASE valido.`);
    }

    const resultado = { medida };

    for (const [campoCatalogo, campoSalida] of VIDRIOS) {
      const vidrio = Number(fila[campoCatalogo]);

      if (!Number.isFinite(vidrio)) {
        throw new Error(
          `La medida ${medida} no tiene un valor valido para ${campoCatalogo}.`,
        );
      }

      resultado[campoSalida] = aplicarPerfil(base + vidrio, perfil, "herrero");
    }

    return resultado;
  });

  return {
    nombre: "Rajas Herrero",
    titulo: "RAJA HERRERO BLANCO",
    perfil,

    compacta: true,

    nota: "Brazo de empuje (manija grande): sumar $10.000",

    diagrama: "rajas",

    columnas: ["Medidas", "3mm", "4mm", "5mm", "Esmerilado", "Fantasía", "3+3"],

    campos: ["medida", "3mm", "4mm", "5mm", "esmerilado", "fantasia", "3+3"],

    columnWidths: [
      { width: 13 },
      { width: 12 },
      { width: 12 },
      { width: 12 },
      { width: 14 },
      { width: 12 },
      { width: 12 },
    ],

    filas,
  };
}

module.exports = transformarRajasHerrero;
