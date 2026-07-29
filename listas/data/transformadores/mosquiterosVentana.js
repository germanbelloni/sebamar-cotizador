"use strict";

const { aplicarPerfil } = require("../../motor/aplicarPerfil");

function mostrarMedida(medida) {
  const [ancho, alto] = String(medida).split("x");
  const altoNumerico = Number(alto);
  return altoNumerico < 100
    ? `${ancho}x0,${altoNumerico}`
    : `${ancho}x${altoNumerico}`;
}

function transformarMosquiterosVentana(filasCatalogo, perfil) {
  const filas = filasCatalogo.map((fila) => {
    const medida = String(fila.MEDIDA || "").trim();
    const base = Number(fila.BASE);

    if (!Number.isFinite(base)) {
      throw new Error(`La medida ${medida} no tiene un valor BASE valido.`);
    }

    return {
      medida: mostrarMedida(medida),
      precio: aplicarPerfil(base, perfil, "moscas"),
    };
  });

  return {
    nombre: "Mosquiteros ventana",
    titulo: "MOSQUITERO P/VENTANA COLOCADA",
    perfil,
    estrecha: true,
    tituloAncho: 110,
    tituloFuente: 8.5,
    columnas: ["Medidas", "MOSQUITERO"],
    campos: ["medida", "precio"],
    filas,
  };
}

module.exports = transformarMosquiterosVentana;
