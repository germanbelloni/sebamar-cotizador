"use strict";

const { aplicarPerfil } = require("../../motor/aplicarPerfil");

function numero(valor, campo, medida) {
  const resultado = Number(valor);

  if (!Number.isFinite(resultado)) {
    throw new Error(`La medida ${medida} no tiene un valor valido para ${campo}.`);
  }

  return resultado;
}

function mostrarMedida(medida) {
  const [ancho, alto] = String(medida).split("x");
  const altoNumerico = Number(alto);

  return altoNumerico < 100 ? `${ancho}x0,${altoNumerico}` : `${ancho}x${altoNumerico}`;
}

function transformarVentanasHerrero(filasCatalogo, perfil) {
  const filas = filasCatalogo.map((fila) => {
    const medida = String(fila.MEDIDA || "").trim();
    const base = numero(fila.BASE, "BASE", medida);
    const guia = numero(fila.GUIA, "GUIA", medida);
    const mosquitero = numero(fila.MOSQUITERO, "MOSQUITERO", medida);
    const vidrio = numero(fila.VIDRIO, "VIDRIO", medida);

    const vidrioEntero = aplicarPerfil(base + vidrio, perfil, "herrero");
    const ventanaConGuia = aplicarPerfil(base + guia + vidrio, perfil, "herrero");
    const precioMosquitero = aplicarPerfil(mosquitero, perfil, "mosquiteros");
    // El wrapper vigente redondea el adicional de 30% antes de aplicar el perfil.
    // Conservamos ese criterio para que la lista y el cotizador den el mismo valor.
    const adicionalRepartido = Math.round((base + vidrio) * 0.3);
    const vidrioRepartido = aplicarPerfil(base + vidrio + adicionalRepartido, perfil, "herrero");

    return {
      medida: mostrarMedida(medida),
      vidrioEntero,
      ventanaConGuia,
      mosquitero: precioMosquitero,
      vidrioRepartido,
    };
  });

  return {
    nombre: "Ventanas Herrero",
    titulo: "VENTANAS HERRERO",
    perfil,
    campos: [
      "medida",
      "vidrioEntero",
      "ventanaConGuia",
      "mosquitero",
      "vidrioRepartido",
    ],
    columnas: [
      "Medidas",
      "Vidrio Entero",
      "Ventana c/guia",
      "Mosquitero",
      "Vidrio Rep.",
    ],
    filas,
  };
}

module.exports = transformarVentanasHerrero;
