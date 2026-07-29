"use strict";

const perfiles = require("../../../backend/config/perfiles");

function aplicarSinDescuento(costo, perfil) {
  const regla = perfiles[perfil]?.herrero;
  if (!regla) throw new Error(`No existe perfil Herrero para ${perfil}.`);
  return Math.round(Number(costo) * (1 + Number(regla.flete || 0)) * (1 + Number(regla.ganancia || 0)));
}

function etiqueta(texto) {
  return String(texto).replace(/_/g, " ").replace(/\b\w/g, (letra) => letra.toUpperCase());
}

function aplanar(valor, ruta = [], filas = []) {
  if (typeof valor === "number") {
    filas.push({ ruta, valor });
    return filas;
  }
  Object.entries(valor || {}).forEach(([clave, hijo]) => aplanar(hijo, [...ruta, clave], filas));
  return filas;
}

function transformarRecargos(superficies, perfil) {
  const filas = [];
  for (const [nombre, factor] of Object.entries(superficies.recargos || {})) {
    filas.push({ detalle: `RECARGO ${etiqueta(nombre)}`, unidad: "Porcentaje", precio: `${Math.round((Number(factor) - 1) * 100)}%` });
  }

  const fuentes = [
    ["Superficies", superficies.superficies], ["Extras", superficies.extras], ["Barrales", superficies.barrales],
    ["Herrajes", superficies.herrajes], ["Puertas Mosquitero", superficies.puertas_mosquitero], ["Vidrios", superficies.vidrios],
  ];
  for (const [seccion, datos] of fuentes) {
    for (const item of aplanar(datos)) {
      filas.push({
        detalle: `${seccion} - ${item.ruta.map(etiqueta).join(" / ")}`,
        unidad: "Precio",
        precio: aplicarSinDescuento(item.valor, perfil),
      });
    }
  }

  return {
    nombre: "Recargos", titulo: "RECARGOS", perfil, compacta: true, detalleAncho: true,
    columnas: ["Detalle", "Unidad", "Precio"], campos: ["detalle", "unidad", "precio"],
    columnWidths: [{ width: 40 }, { width: 16 }, { width: 18 }], filas,
  };
}

module.exports = transformarRecargos;
