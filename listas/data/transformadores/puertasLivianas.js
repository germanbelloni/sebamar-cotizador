"use strict";

const { aplicarPerfil } = require("../../motor/aplicarPerfil");

function transformarPuertasLivianas(filasCatalogo, perfil) {
  const filas = filasCatalogo.map((fila) => {
    const modelo = String(fila.MODELO || "").trim();
    const base = Number(fila.BASE);
    if (!Number.isFinite(base))
      throw new Error(`El ${modelo} no tiene BASE valida.`);
    const esCiega = modelo.toUpperCase() === "MODELO 5";

    const precio = (campo) => {
      const vidrio = Number(fila[campo]);

      if (esCiega && campo === "3MM") {
        return aplicarPerfil(base, perfil, "herrero");
      }

      return vidrio > 0 ? aplicarPerfil(base + vidrio, perfil, "herrero") : "-";
    };

    return {
      modelo,
      "3mm": precio("3MM"),
      "4mm": precio("4MM"),
      fantasia: precio("FANTASIA"),
    };
  });
  return {
    nombre: "Puertas Livianas",
    titulo: "PUERTAS LIVIANAS 25 mm",
    perfil,
    diagrama: "puertas-eco",
    columnas: ["Modelo", "V/3mm", "V/4mm", "Fantasia"],
    campos: ["modelo", "3mm", "4mm", "fantasia"],
    filas,
  };
}
module.exports = transformarPuertasLivianas;
