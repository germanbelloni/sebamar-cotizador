"use strict";

const { aplicarPerfil } = require("../../motor/aplicarPerfil");

const VIDRIOS = [
  ["3MM", "3mm"],
  ["4MM", "4mm"],
  ["5MM", "5mm"],
  ["FANTASIA", "fantasia"],
  ["ESMERILADO", "esmerilado"],
  ["3+3", "3+3"],
];

function transformarPuertasHerrero(filasCatalogo, perfil) {
  const filas = filasCatalogo
    .filter((fila) => String(fila.MODELO || "").toUpperCase() !== "ADICIONALES")
    .map((fila) => {
      const modelo = String(fila.MODELO || "").trim();
      const base = Number(fila.BASE);

      if (!Number.isFinite(base)) {
        throw new Error(`El ${modelo} no tiene BASE valida.`);
      }

      const resultado = { modelo };

      const esEspecial =
        modelo.toUpperCase() === "MODELO 5" ||
        modelo.toUpperCase() === "MODELO C/PANEL";

      for (const [origen, destino] of VIDRIOS) {
        const vidrio = Number(fila[origen]);

        if (esEspecial && destino === "3mm") {
          resultado[destino] = aplicarPerfil(base, perfil, "herrero");
        } else {
          resultado[destino] =
            vidrio > 0 ? aplicarPerfil(base + vidrio, perfil, "herrero") : "-";
        }
      }

      return resultado;
    });

  return {
    nombre: "Puertas Herrero",
    titulo: "PUERTAS HERRERO",
    perfil,
    compacta: true,
    diagrama: "puertas",
    columnas: [
      "Modelos",
      "3mm",
      "4mm",
      "5mm",
      "Fantasia",
      "Esmerilado",
      "V3+3",
    ],
    campos: ["modelo", "3mm", "4mm", "5mm", "fantasia", "esmerilado", "3+3"],
    columnWidths: [
      { width: 18 },
      { width: 12 },
      { width: 12 },
      { width: 12 },
      { width: 14 },
      { width: 14 },
      { width: 12 },
    ],
    filas,
  };
}

module.exports = transformarPuertasHerrero;
