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

function transformarPuertasModena(filasCatalogo, perfil) {
  const filas = filasCatalogo.map((fila) => {
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
        resultado[destino] = aplicarPerfil(base, perfil, "modena");
      } else {
        resultado[destino] =
          vidrio > 0 ? aplicarPerfil(base + vidrio, perfil, "modena") : "-";
      }
    }

    const vidrio4 = Number(fila["4MM"]);
    const camara = Number(fila.DVH);

    resultado.dvh =
      vidrio4 > 0 && camara > 0
        ? aplicarPerfil(base + vidrio4 * 2 + camara, perfil, "modena")
        : "-";

    return resultado;
  });

  return {
    nombre: "Puertas Modena",
    titulo: "PUERTAS MODENA",
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
      "DVH",
    ],
    campos: [
      "modelo",
      "3mm",
      "4mm",
      "5mm",
      "fantasia",
      "esmerilado",
      "3+3",
      "dvh",
    ],
    columnWidths: [
      { width: 17 },
      { width: 11 },
      { width: 11 },
      { width: 11 },
      { width: 13 },
      { width: 13 },
      { width: 12 },
      { width: 12 },
    ],
    filas,
  };
}

module.exports = transformarPuertasModena;
