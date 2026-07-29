"use strict";

const perfiles = require("../../backend/config/perfiles");

function obtenerPerfil(nombrePerfil, linea) {
  const perfil = perfiles[nombrePerfil]?.[linea];

  if (!perfil) {
    throw new Error(`Perfil inexistente: ${nombrePerfil} -> ${linea}`);
  }

  return perfil;
}

function aplicarPorcentaje(precio, porcentaje, operador) {
  if (porcentaje === undefined || porcentaje === null) {
    return precio;
  }

  return precio * (1 + operador * Number(porcentaje));
}

/**
 * Aplica la regla definida por backend/config/perfiles.js.
 *
 * Herrero y Modena usan descuento -> flete -> ganancia. Otros perfiles
 * pueden definir aumentos en vez de descuento; no se agregan porcentajes
 * comerciales propios en el generador.
 */
function aplicarPerfil(costo, nombrePerfil, linea) {
  const perfil =
    typeof nombrePerfil === "object"
      ? nombrePerfil
      : obtenerPerfil(nombrePerfil, linea);
  let precio = Number(costo);

  if (!Number.isFinite(precio)) {
    throw new Error(`Costo invalido para ${nombrePerfil} -> ${linea}.`);
  }

  precio = aplicarPorcentaje(precio, perfil.descuento, -1);
  precio = aplicarPorcentaje(precio, perfil.aumento, 1);
  precio = aplicarPorcentaje(precio, perfil.aumento1, 1);
  precio = aplicarPorcentaje(precio, perfil.aumento2, 1);
  precio = aplicarPorcentaje(precio, perfil.flete, 1);
  precio = aplicarPorcentaje(precio, perfil.ganancia, 1);

  return Math.round(precio);
}

module.exports = {
  aplicarPerfil,
  obtenerPerfil,
};
