"use strict";

const { aplicarPerfil } = require("../../motor/aplicarPerfil");

const VIDRIOS = [
  ["4MM", "4mm"],
  ["3+3", "3+3"],
  ["FANTASIA", "fantasia"],
  ["ESMERILADO", "esmerilado"],
];

function transformarMediaPuertaHerrero(filasCatalogo, perfil) {
  const filas = filasCatalogo.map((fila) => {
    const modelo = String(fila.MODELO || "").trim();
    const base = Number(fila.BASE);
    if (!Number.isFinite(base))
      throw new Error(`El modelo ${modelo} no tiene BASE valida.`);
    const resultado = { modelo };
    for (const [origen, destino] of VIDRIOS) {
      const vidrio = Number(fila[origen]);
      resultado[destino] =
        vidrio > 0 ? aplicarPerfil(base + vidrio, perfil, "herrero") : "-";
    }
    return resultado;
  });

  return {
    nombre: "Media Puerta Herrero",
    titulo: "1/2 PUERTA HERRERO",
    perfil,

    tituloAncho: 145,

    columnas: ["Modelo", "V/4mm", "V/3+3", "Fantasia", "Esmerilado"],
    campos: ["modelo", "4mm", "3+3", "fantasia", "esmerilado"],
    filas,
  };
}

module.exports = transformarMediaPuertaHerrero;
